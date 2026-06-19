'use client';

import { useState } from 'react';
import FormField from '../components/FormField';
import ErrorBanner from '../components/ErrorBanner';
import { useSessionState } from '../hooks/useSessionState';
import { searchGmbBusinesses } from '../lib/api';

const DEFAULTS = {
  business_query: '',
  max_results: 20,
  places: [],
  selected_place_title: '',
  location_query: '',
};

export default function GmbReportForm({ loading, error, onDismissError, onSubmit }) {
  const [fields, setFields] = useSessionState('form_gmb', DEFAULTS);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSearch = async () => {
    if (!fields.business_query.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    try {
      const result = await searchGmbBusinesses({
        business_query: fields.business_query.trim(),
        max_results: Number(fields.max_results),
      });
      if (result.success && result.places && result.places.length > 0) {
        setFields(prev => ({ 
          ...prev, 
          places: result.places,
          selected_place_title: result.places[0].title 
        }));
      } else {
        setFields(prev => ({ ...prev, places: [], selected_place_title: '' }));
        setSearchError('No businesses found matching that query.');
      }
    } catch (err) {
      setFields(prev => ({ ...prev, places: [], selected_place_title: '' }));
      setSearchError(err.message || 'Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.selected_place_title || !fields.location_query.trim()) {
      return;
    }
    
    onSubmit({
      target_business_name: fields.selected_place_title,
      location_query: fields.location_query.trim(),
    });
  };

  const dismissSearchError = () => setSearchError('');

  return (
    <form id="form-gmb-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">GMB Audit</h2>
      <p className="form-panel-subtitle">
        Deep competitor analysis for your Google My Business profile.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}
      {searchError && <ErrorBanner message={searchError} onDismiss={dismissSearchError} />}

      <div className="form-grid" style={{ marginTop: (error || searchError) ? 16 : 0 }}>
        <FormField label="Search Business Name *" htmlFor="gmb-business-query">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="gmb-business-query"
              className="form-input"
              type="text"
              placeholder='e.g. "Dental clinics in Howrah"'
              value={fields.business_query}
              onChange={set('business_query')}
              required
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handleSearch}
              disabled={isSearching || !fields.business_query.trim()}
              style={{ 
                width: 'auto', 
                padding: '0 16px', 
                margin: 0,
                opacity: (isSearching || !fields.business_query.trim()) ? 0.7 : 1 
              }}
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </div>
        </FormField>

        {fields.places && fields.places.length > 0 && (
          <FormField label="Select Your Business *" htmlFor="gmb-selected-place">
            <select
              id="gmb-selected-place"
              className="form-input"
              value={fields.selected_place_title}
              onChange={set('selected_place_title')}
              required
            >
              {fields.places.map((place, idx) => (
                <option key={place.placeId || idx} value={place.title}>
                  {place.title} ({place.address})
                </option>
              ))}
            </select>
          </FormField>
        )}

        {fields.places && fields.places.length > 0 && (
          <FormField label="Competitor Location/Neighborhood *" htmlFor="gmb-location-query">
            <input
              id="gmb-location-query"
              className="form-input"
              type="text"
              placeholder='e.g. "Brooklyn, NY" or "Howrah, West Bengal"'
              value={fields.location_query}
              onChange={set('location_query')}
              required
            />
          </FormField>
        )}

        {fields.places && fields.places.length > 0 && (
          <button
            id="btn-generate-gmb"
            type="submit"
            className="btn-primary"
            disabled={loading || !fields.selected_place_title || !fields.location_query.trim()}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" />Generating…</>
            ) : (
              <><span aria-hidden="true">🔍</span>Generate Report</>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

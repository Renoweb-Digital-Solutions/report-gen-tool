'use client';

import { useRef } from 'react';
import FileUploadZone from '../components/FileUploadZone';
import ErrorBanner from '../components/ErrorBanner';
import { Sparkles } from 'lucide-react';

export default function VisualBrandForm({ loading, error, onDismissError, onSubmit }) {
  const websiteFileRef = useRef(null);
  const instagramFileRef = useRef(null);

  const handleWebsiteFile = (file) => { websiteFileRef.current = file; };
  const handleInstagramFile = (file) => { instagramFileRef.current = file; };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!websiteFileRef.current || !instagramFileRef.current) {
      alert('Please upload both images before running the analysis.');
      return;
    }
    const formData = new FormData();
    formData.append('website_image', websiteFileRef.current);
    formData.append('instagram_moodboard_image', instagramFileRef.current);
    onSubmit(formData);
  };

  return (
    <form id="form-visual-report" onSubmit={handleSubmit} noValidate>
      <h2 className="form-panel-title">Visual Brand Match</h2>
      <p className="form-panel-subtitle">
        Compare your website and Instagram moodboard for visual brand consistency.
      </p>

      {error && <ErrorBanner message={error} onDismiss={onDismissError} />}

      <div className="form-grid" style={{ marginTop: error ? 16 : 0 }}>
        <FileUploadZone
          label="Website Screenshot *"
          id="upload-website-image"
          accept="image/*"
          onFileSelect={handleWebsiteFile}
        />

        <FileUploadZone
          label="Instagram Moodboard *"
          id="upload-instagram-moodboard"
          accept="image/*"
          onFileSelect={handleInstagramFile}
        />

        <button
          id="btn-generate-visual"
          type="submit"
          className={`btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {!loading && (
            <>
              <Sparkles size={18} strokeWidth={2.5} />
              Generate Report
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import React from 'react';

function AdCard({ ad, provider }) {
  const { id, llm_analysis } = ad;

  // Basic Info
  const advertiserName = ad.advertiser_name || ad.page_name || 'Unknown Advertiser';
  const format = ad.ad_format || 'Unknown Format';
  const platform = ad.platform || (ad.publisher_platforms && ad.publisher_platforms.join(', ')) || 'Unknown Platform';
  
  // Try to find image or text to display
  const creativeBody = ad.text || ad.primary_text || (ad.ad_creative_bodies && ad.ad_creative_bodies[0]) || '';
  const imageUrl = (ad.image_urls && ad.image_urls[0]) || ad.image_url || (ad.video_urls && ad.video_urls[0]) || '';
  const previewUrl = ad.preview_url || ad.source_url || '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{advertiserName}</h4>
          <div className="text-sm text-gray-500 mt-1 uppercase tracking-wide font-semibold">
            {provider} • {platform} • {format}
          </div>
          <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {ad.ad_start_date && (
              <div>
                <span className="font-medium text-gray-700">Run Dates:</span> {ad.ad_start_date.split('T')[0]} {ad.is_active ? ' - Present' : (ad.ad_end_date ? ` - ${ad.ad_end_date.split('T')[0]}` : '')}
              </div>
            )}
            {typeof ad.is_active === 'boolean' && (
              <div>
                <span className="font-medium text-gray-700">Status:</span> {ad.is_active ? <span className="text-emerald-600 font-semibold">Active</span> : 'Inactive'}
              </div>
            )}
            {ad.duration_days !== undefined && ad.duration_days !== null && (
              <div>
                <span className="font-medium text-gray-700">Duration:</span> {ad.duration_days} days
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
          ID: {id}
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {(imageUrl || creativeBody || previewUrl) && (
          <div className="md:col-span-1 bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col">
            <h5 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3 flex-shrink-0">Creative Preview</h5>
            {imageUrl && (
              <a href={previewUrl || imageUrl} target="_blank" rel="noopener noreferrer" className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm block hover:opacity-90 transition-opacity">
                {imageUrl.includes('.mp4') ? (
                  <video src={imageUrl} controls className="w-full h-auto object-cover" />
                ) : (
                  <img src={imageUrl} alt="Ad Creative" className="w-full h-auto object-cover" />
                )}
              </a>
            )}
            {creativeBody && (
              <div className="text-sm text-gray-700 italic bg-white p-3 rounded border border-gray-200 shadow-sm relative mb-4">
                <span className="absolute -top-2 -left-2 text-2xl text-gray-300">"</span>
                <div className="max-h-60 overflow-y-auto pr-2 whitespace-pre-wrap">
                  {creativeBody}
                </div>
                <span className="absolute -bottom-4 -right-2 text-2xl text-gray-300">"</span>
              </div>
            )}
            {!imageUrl && !creativeBody && previewUrl && (
              <div className="text-sm text-gray-400 italic text-center py-6 mb-4">No visual preview available</div>
            )}
            <div className="mt-auto">
              {previewUrl ? (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                  View Ad in Library ↗
                </a>
              ) : (
                <div className="text-xs text-gray-400 text-center">Preview link unavailable</div>
              )}
            </div>
          </div>
        )}
        
        <div className={(imageUrl || creativeBody || previewUrl) ? "md:col-span-2 space-y-4" : "md:col-span-3 space-y-4"}>
          <h5 className="text-xs uppercase text-indigo-500 font-bold tracking-wider border-b border-indigo-100 pb-2">AI Creative Analysis</h5>
          
          {llm_analysis ? (
            <div className="grid grid-cols-1 gap-4">
              {llm_analysis.profitability && llm_analysis.profitability.assessment && llm_analysis.profitability.assessment !== 'unknown' && (
                <div className="bg-emerald-50/50 rounded-lg p-3">
                  <div className="text-xs font-bold text-emerald-800 mb-1">Profitability Assessment</div>
                  <div className="text-sm text-gray-800">
                    <span className="font-semibold uppercase text-xs mr-2 px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded">{llm_analysis.profitability.assessment}</span>
                    {llm_analysis.profitability.reasoning !== 'unknown' ? llm_analysis.profitability.reasoning : ''}
                  </div>
                </div>
              )}
              {llm_analysis.creative_analysis && llm_analysis.creative_analysis.hook && llm_analysis.creative_analysis.hook !== 'unknown' && (
                <div className="bg-blue-50/50 rounded-lg p-3">
                  <div className="text-xs font-bold text-blue-800 mb-1">Creative Hook</div>
                  <div className="text-sm text-gray-800">{llm_analysis.creative_analysis.hook}</div>
                </div>
              )}
              {llm_analysis.creative_analysis && llm_analysis.creative_analysis.value_proposition && llm_analysis.creative_analysis.value_proposition !== 'unknown' && (
                <div className="bg-purple-50/50 rounded-lg p-3">
                  <div className="text-xs font-bold text-purple-800 mb-1">Value Proposition</div>
                  <div className="text-sm text-gray-800">{llm_analysis.creative_analysis.value_proposition}</div>
                </div>
              )}
              {llm_analysis.creative_analysis && llm_analysis.creative_analysis.emotional_trigger && llm_analysis.creative_analysis.emotional_trigger !== 'unknown' && (
                <div className="bg-orange-50/50 rounded-lg p-3">
                  <div className="text-xs font-bold text-orange-800 mb-1">Emotional Trigger</div>
                  <div className="text-sm text-gray-800">{llm_analysis.creative_analysis.emotional_trigger}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic bg-gray-50 rounded-lg p-6 text-center border border-dashed border-gray-300">
              Analysis unavailable for this ad creative.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdsLibraryTable({ adsData }) {
  if (!adsData || !adsData.providers) {
    return <div className="text-gray-500 italic p-6 text-center">No ads data available.</div>;
  }

  const allAds = [];
  
  Object.entries(adsData.providers).forEach(([providerName, providerData]) => {
    if (providerData && providerData.ads && Array.isArray(providerData.ads)) {
      providerData.ads.forEach(ad => {
        allAds.push({ ...ad, __provider: providerName });
      });
    }
  });

  if (allAds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Ads Found</h3>
        <p className="text-gray-500">We couldn't find any active ads matching your search criteria on the selected platforms.</p>
      </div>
    );
  }

  const formatVerdictText = (text) => {
    if (!text) return 'N/A';
    
    const listRegex = /(?=\b\d+[\)\.]\s)/;
    if (listRegex.test(text)) {
      const parts = text.split(listRegex).filter(p => p.trim());
      const intro = [];
      const listItems = [];
      
      parts.forEach(part => {
        if (/^\d+[\)\.]\s/.test(part)) {
          listItems.push(part.replace(/^\d+[\)\.]\s/, '').trim());
        } else {
          intro.push(part.trim());
        }
      });
      
      return (
        <div className="text-sm text-gray-800">
          {intro.length > 0 && <p className="mb-3">{intro.join(' ')}</p>}
          {listItems.length > 0 && (
            <ol className="list-decimal list-outside ml-4 space-y-2">
              {listItems.map((item, i) => (
                <li key={i} className="pl-1 leading-relaxed">{item}</li>
              ))}
            </ol>
          )}
        </div>
      );
    }
    
    return <p className="text-sm text-gray-800 leading-relaxed">{text}</p>;
  };

  return (
    <div className="ads-audit-container p-4 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <img src="/logo.png" alt="Renoweb Logo" className="h-8 object-contain" />
        <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Ads Library Audit Report</span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ads Library Intelligence</h2>
        <p className="text-gray-600 mt-1">Cross-platform ad intelligence and creative breakdown.</p>
      </div>

      {adsData.overall_verdict && (
        <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Overall AI Verdict
          </h3>
          <div className="flex flex-col gap-4">
            <div className="bg-white/80 rounded-lg p-4 border border-indigo-50 shadow-sm">
              <h4 className="text-xs uppercase font-bold text-indigo-500 tracking-wider mb-3">Executive Summary</h4>
              {formatVerdictText(adsData.overall_verdict.executive_summary)}
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-indigo-50 shadow-sm">
              <h4 className="text-xs uppercase font-bold text-purple-500 tracking-wider mb-3">Dominant Strategy</h4>
              {formatVerdictText(adsData.overall_verdict.dominant_strategy)}
            </div>
            <div className="bg-white/80 rounded-lg p-4 border border-indigo-50 shadow-sm">
              <h4 className="text-xs uppercase font-bold text-pink-500 tracking-wider mb-3">Opportunities</h4>
              {formatVerdictText(adsData.overall_verdict.opportunities)}
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {allAds.map((ad, idx) => (
          <AdCard key={ad.id || idx} ad={ad} provider={ad.__provider} />
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center justify-center opacity-80">
        <img src="/logo.png" alt="Renoweb Logo" className="h-10 object-contain mb-2" />
        <div className="text-xs text-gray-400">© 2026 Renoweb Digital Solutions</div>
      </div>
    </div>
  );
}

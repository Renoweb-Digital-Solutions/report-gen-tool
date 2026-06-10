import React from 'react';

const INTERNAL_STATUS_VALUES = new Set([
  "skipped",
  "skipped_limit",
  "not_attempted",
  "failed",
  "error",
  "none",
  "null",
  "no_transcript",
  "transcription_not_done",
  "frame_skipped",
  "media_analyzed_0",
  "fallback_caption",
  "caption_fallback"
]);

function cleanText(value) {
  if (!value) return "";

  const text = String(value).trim();

  if (!text) return "";

  const lower = text.toLowerCase();

  const blocked = [
    "not attempted",
    "skipped",
    "no transcript",
    "transcription not done",
    "frame analysis skipped",
    "media elements analyzed: 0",
    "backend",
    "internal error"
  ];

  if (blocked.some((phrase) => lower.includes(phrase))) {
    return "";
  }
  
  if (INTERNAL_STATUS_VALUES.has(lower)) {
    return "";
  }

  return text;
}

function getPostFormatLabel(format) {
  const map = {
    image: "Image",
    image_or_carousel: "Image / Carousel",
    video: "Video",
    caption_only: "Text / Caption",
    post: "Post",
    unknown: "Post"
  };

  return map[format] || "Post";
}

function getMethodLabel(method) {
  const allowed = [
    "Caption analysis",
    "Visual analysis",
    "Video transcript analysis",
    "Video + visual analysis"
  ];

  if (allowed.includes(method)) return method;

  return "Analysis";
}

function getTopic(post) {
  return (
    cleanText(post.topic) ||
    cleanText(post.post_topic) ||
    "General post analysis"
  );
}

function getContentInsight(post) {
  return (
    cleanText(post.content_insight) ||
    cleanText(post.transcript_summary) ||
    cleanText(post.caption_for_funnel_analysis) ||
    cleanText(post.caption)
  );
}

function getVisualInsight(post) {
  return (
    cleanText(post.visual_insight) ||
    cleanText(post.visual_summary)
  );
}

function getRecommendation(post) {
  return (
    cleanText(post.recommendation) ||
    cleanText(post.suggestion)
  );
}

function StageBadge({ stage }) {
  const cleanStage = cleanText(stage).toUpperCase();
  if (!['TOFU', 'MOFU', 'BOFU'].includes(cleanStage)) {
    return cleanStage ? <div>{cleanStage}</div> : null;
  }
  
  let className = "stage-badge ";
  if (cleanStage === 'TOFU') className += "stage-tofu";
  if (cleanStage === 'MOFU') className += "stage-mofu";
  if (cleanStage === 'BOFU') className += "stage-bofu";
  
  return <span className={className}>{cleanStage}</span>;
}

export default function SocialAuditTable({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="audit-table-container">
      <table className="audit-table">
        <thead>
          <tr>
            <th>Post</th>
            <th>Format / Method</th>
            <th>Stage / Engagement</th>
            <th>Content / Topic</th>
            <th>Visual Summary / Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, i) => {
            const index = post.index || post.post_number || (i + 1);
            const url = post.url || post.post_url;
            const formatLabel = getPostFormatLabel(post.format);
            const methodLabel = getMethodLabel(post.method);
            const topic = getTopic(post);
            const contentInsight = getContentInsight(post);
            const visualInsight = getVisualInsight(post);
            const recommendation = getRecommendation(post);
            const likes = post.likes ?? "N/A";
            const comments = post.comments ?? "N/A";
            
            return (
              <tr key={index}>
                <td className="post-cell">
                  <div className="post-index">#{index}</div>
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="post-link">
                      Open post
                    </a>
                  )}
                </td>
                <td className="format-cell">
                  <div className="format-label">{formatLabel}</div>
                  <div className="method-label">{methodLabel}</div>
                </td>
                <td className="engagement-cell">
                  <StageBadge stage={post.stage || post.funnel_hint} />
                  <div className="engagement-stats">
                    <div>Likes: {likes}</div>
                    <div>Comments: {comments}</div>
                  </div>
                </td>
                <td className="insight-cell">
                  <div className="insight-topic">
                    <strong>Topic:</strong> {topic}
                  </div>
                  {contentInsight && (
                    <div className="insight-content">
                      <strong>Content Insight:</strong>
                      <p>{contentInsight}</p>
                    </div>
                  )}
                </td>
                <td className="recommendation-cell">
                  {visualInsight && (
                    <div className="insight-visual">
                      <strong>Visual Insight:</strong>
                      <p>{visualInsight}</p>
                    </div>
                  )}
                  {recommendation && (
                    <div className="insight-recommendation">
                      <strong>Recommendation:</strong>
                      <p>{recommendation}</p>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

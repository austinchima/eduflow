import React from 'react';

const getUnsplashUrl = (query) =>
  `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;

const getYouTubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const iconMap = {
  robot: '🤖',
  brain: '🧠',
  code: '💻',
  data: '📊',
  eye: '👁️',
  text: '📝',
  default: '📚',
};

const StudyPlanContent = ({ plan }) => {
  if (!plan) return null;
  const { title, summary, imagePrompt, keyConcepts, video, interactiveExample } = plan;

  // Pick the first icon word in the icon string, fallback to default
  const getIcon = (icon) => {
    if (!icon) return iconMap.default;
    const key = icon.toLowerCase().split(/\W+/)[0];
    return iconMap[key] || iconMap.default;
  };

  return (
    <div className="space-y-8">
      {/* Title and Summary */}
      {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
      {summary && <p className="text-base text-text-secondary mb-4">{summary}</p>}

      {/* Image from Unsplash */}
      {imagePrompt && (
        <div className="my-4 flex justify-center">
          <img
            src={getUnsplashUrl(imagePrompt)}
            alt={imagePrompt}
            className="rounded-lg shadow max-w-full h-auto"
            style={{ maxHeight: 320 }}
          />
        </div>
      )}

      {/* Key Concepts */}
      {keyConcepts && keyConcepts.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Key Concepts</h3>
          <ul className="space-y-4">
            {keyConcepts.map((concept, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <span className="text-2xl mt-1">{getIcon(concept.icon)}</span>
                <div>
                  <div className="font-semibold">{concept.name}</div>
                  <div className="text-text-secondary text-sm">{concept.explanation}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* YouTube Video */}
      {video && (
        <section>
          <h3 className="text-xl font-semibold mb-2 mt-6">Recommended Video</h3>
          <div className="my-4 flex flex-col items-center">
            <a
              href={getYouTubeSearchUrl(video)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline mb-2"
            >
              Search YouTube for: {video}
            </a>
            {/* Optionally, embed the first video if you want to scrape or use an API */}
          </div>
        </section>
      )}

      {/* Interactive Example */}
      {interactiveExample && (
        <section>
          <h3 className="text-xl font-semibold mb-2 mt-6">Interactive Example</h3>
          <div className="bg-secondary-50 border border-border rounded-lg p-4">
            {typeof interactiveExample === 'object' ? (
              <div>
                {interactiveExample.title && <h4 className="font-medium mb-2">{interactiveExample.title}</h4>}
                {interactiveExample.description && <p className="text-text-secondary mb-2">{interactiveExample.description}</p>}
                {interactiveExample.steps && (
                  <div>
                    <div className="font-medium mb-1">Steps:</div>
                    <ol className="list-decimal ml-4">
                      {interactiveExample.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="text-text-secondary">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {interactiveExample.codeExample && (
                  <div className="mt-2">
                    <div className="font-medium mb-1">Code Example:</div>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{interactiveExample.codeExample}</pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-text-secondary">{interactiveExample}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudyPlanContent; 
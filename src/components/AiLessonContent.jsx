import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import YouTubeEmbed from "./YouTubeEmbed";

// Helper to extract YouTube links from text
const extractYouTubeLinks = (text) => {
  const regex = /https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/g;
  return text.match(regex) || [];
};

export default function AiLessonContent({ content, topic = '', onFeedback }) {
  const [feedback, setFeedback] = useState(null);

  // Extract YouTube links and remove them from the markdown
  const youTubeLinks = extractYouTubeLinks(content);
  const contentWithoutYouTubeLinks = content.replace(
    /https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/g,
    ""
  );

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) onFeedback(type, topic);
  };

  return (
    <div>
      <ReactMarkdown
        children={contentWithoutYouTubeLinks}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            return !inline ? (
              <SyntaxHighlighter language="csharp" PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props}>{children}</code>
            );
          },
        }}
      />
      {youTubeLinks.map((url) => (
        <YouTubeEmbed key={url} url={url} />
      ))}
      <div className="flex gap-4 mt-4 items-center">
        {feedback ? (
          <span className="text-green-600 font-semibold">Thank you for your feedback!</span>
        ) : (
          <>
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleFeedback('like')}
              aria-label="Like this lesson"
            >👍 Like</button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleFeedback('dislike')}
              aria-label="Dislike this lesson"
            >👎 Dislike</button>
          </>
        )}
      </div>
    </div>
  );
} 
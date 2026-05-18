'use client';

import React, { useEffect, useState } from 'react';

export function ProgressIndicator(): React.JSX.Element {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="progress-indicator" aria-hidden="true">
      <div
        className="progress-bar"
        style={{ transform: `scaleY(${progress})` }}
      />
      <div className="progress-dot" style={{ top: `${progress * 100}%` }} />
    </div>
  );
}

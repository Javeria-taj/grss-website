'use client';

import React, { useRef, useEffect, useState } from 'react';

export function NavigationSystem(): React.JSX.Element {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`nav-system ${scrolled ? 'nav-scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="nav-inner">
        {/* Logo / Identity */}
        <a href="#" className="nav-logo" aria-label="IEEE GRSS Home">
          <span className="nav-logo-text">IEEE GRSS</span>
        </a>

        {/* Links */}
        <ul className="nav-links" role="list">
          <li>
            <a href="#mission" className="nav-link">Mission</a>
          </li>
          <li>
            <a href="#research" className="nav-link">Research</a>
          </li>
          <li>
            <a href="#community" className="nav-link">Community</a>
          </li>
          <li>
            <a
              href="https://www.ieee-grss.org"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
            >
              Join GRSS
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

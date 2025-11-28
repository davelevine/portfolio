import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import '../styles/globals.scss';

// Disable SSR for Navbar to preserve framer-motion animations and avoid hydration mismatch
const Navbar = dynamic(() => import('../components/layout/navbar/navbar'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  // Always start with 'dark' on both server and client to avoid hydration mismatch
  const [theme, setTheme] = useState('dark');

  // Set theme from system preference after mount (client-side only)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    // Set initial theme from system preference
    setTheme(mediaQuery.matches ? 'light' : 'dark');

    // Listen for system theme changes
    const setThemeFromMedia = (e) => setTheme(e.matches ? 'light' : 'dark');
    mediaQuery.addEventListener('change', setThemeFromMedia);

    return () => {
      mediaQuery.removeEventListener('change', setThemeFromMedia);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme === 'dark' ? '#121212' : '#ffffff'} />
      </Head>
      <div className="app" data-theme={theme}>
        <Navbar theme={theme} newTheme={setTheme} />
        <Component {...pageProps} currentTheme={theme} />
      </div>
    </>
  );
}

export default MyApp;

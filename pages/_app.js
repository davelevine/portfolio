import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '../styles/globals.scss';

const Navbar = dynamic(() => import('../components/layout/navbar/navbar'), {
  ssr: true, // Enable SSR for navbar to avoid layout shifts
});

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState(() => {
    // Initialize theme properly
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Media query listener with proper browser compatibility
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    // Handle browser compatibility
    const setThemeFromMedia = (e) => setTheme(e.matches ? 'light' : 'dark');

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', setThemeFromMedia);
    } 
    // Safari and older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(setThemeFromMedia);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', setThemeFromMedia);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(setThemeFromMedia);
      }
    };
  }, []);

  // Simplified navigation event tracking
  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleComplete = () => setIsNavigating(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

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

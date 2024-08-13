import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '../styles/globals.scss';

const Navbar = dynamic(() => import('../components/layout/navbar/navbar'), {
  loading: () => <div className="skeleton-loader"></div>,
});

const initializeTheme = () => (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const themeListener = (e) => setTheme(e.matches ? 'light' : 'dark');

    if (typeof window !== 'undefined') {
      mediaQuery.addEventListener('change', themeListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        mediaQuery.removeEventListener('change', themeListener);
      }
    };
  }, []);

  return [theme, setTheme];
};

const useNavigation = (router) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLinkClick = useCallback((event) => {
    const target = event.target.closest('a');
    if (target && target.href && target.origin === window.location.origin) {
      event.preventDefault();

      if (isNavigating) return;

      setIsNavigating(true);
      const url = target.getAttribute('href');

      const navigate = url === window.location.pathname ? router.replace : router.push;
      navigate(url).finally(() => setIsNavigating(false));
    }
  }, [isNavigating, router]);

  useEffect(() => {
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [handleLinkClick]);

  useEffect(() => {
    const handleRouteChangeStart = () => setIsNavigating(true);
    const handleRouteChangeEnd = () => setIsNavigating(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router]);

  return isNavigating;
};

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useTheme();
  const router = useRouter();
  const isNavigating = useNavigation(router);

  return (
    <React.StrictMode>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app" data-theme={theme}>
        <Navbar theme={theme} newTheme={setTheme} />
        <Component {...pageProps} currentTheme={theme} />
      </div>
    </React.StrictMode>
  );
}

export default MyApp;

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '../styles/globals.scss';

// Dynamically import the Navbar component for code splitting
const Navbar = dynamic(() => import('../components/layout/navbar/navbar'), {
  loading: () => <div className="skeleton-loader"></div>,
});

// Refactored to extract the theme initialization logic into a separate function for better readability and reusability
const initializeTheme = () => {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark');
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setTheme(initializeTheme());
  }, []);

  useEffect(() => {
    const handleLinkClick = (event) => {
      const target = event.target.closest('a');
      if (target && target.href && target.origin === window.location.origin) {
        event.preventDefault();
        
        if (isNavigating) {
          return; // Prevent multiple navigations at the same time
        }

        setIsNavigating(true);

        const url = target.getAttribute('href');
        
        if (url === window.location.pathname) {
          router.replace(url).finally(() => setIsNavigating(false));
        } else {
          router.push(url).finally(() => setIsNavigating(false));
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [router, isNavigating]);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
      rebindHandlers();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  const rebindHandlers = () => {
    // Reinitialize any necessary components or event handlers here
    // For example, if you're using a library like jQuery:
    // $(document).ready(function() {
    //   // Your jQuery code here
    // });
  };

  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app" data-theme={theme}>
        <Navbar theme={theme} newTheme={setTheme} />
        <Component {...pageProps} currentTheme={theme} />
      </div>
    </>
  );
}

export default MyApp;

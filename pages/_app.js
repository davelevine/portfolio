import React from 'react';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/navbar/navbar';
import Footer from '../components/layout/footer';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Dave Levine - Solutions Engineer</title>

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />

        {/* Add links for different favicon sizes here */}
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon/android-chrome-512x512.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
      </Head>
      <div className="app" data-theme={theme}>
        <Navbar theme={theme} newTheme={setTheme} />
        <Component {...pageProps} currentTheme={theme} />
        <Footer />
      </div>
    </>
  );
}

export default MyApp;

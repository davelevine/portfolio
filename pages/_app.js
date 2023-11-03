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

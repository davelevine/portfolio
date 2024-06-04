import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/layout/navbar/navbar';
import Footer from '../components/layout/footer';
import '../styles/globals.scss';

// Refactored to extract the theme initialization logic into a separate function for better readability and reusability
const initializeTheme = () => {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(initializeTheme);
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

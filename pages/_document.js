import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* Link to locally hosted Google Fonts CSS */}
          <link
            rel='stylesheet'
            href='/fonts/googlefonts/google-fonts.css'
          />

          {/* Link to locally hosted FontAwesome CSS (all.min.css) */}
          <link
            rel='stylesheet'
            href='/fonts/all.min.css' // Adjust the path as needed
          />

          {/* No need for custom @font-face declarations for Font Awesome */}
          {/* Plausible tracking script */}
          <script defer data-domain="www.davelevine.io" data-api="/data/api/event" src="/data/js/script.js"></script>

          <link rel="shortcut icon" href="/images/favicon/favicon.ico" />

          {/* Add links for different favicon sizes here */}
          <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/images/favicon/android-chrome-512x512.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

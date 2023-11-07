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

          {/* Link to CDN hosted FontAwesome CSS */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous"
            referrerpolicy="no-referrer"
          />

          {/* Reference to manifest.json */}
          <link rel="manifest" href="/manifest.json" />

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

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* Reference to manifest.json */}
          <link rel="manifest" href="/manifest.json" />

          {/* Single favicon.ico with multiple sizes */}
          <link rel="icon" type="image/x-icon" href="/images/favicon/favicon.ico" />
          
          {/* Plausible tracking script */}
          <script defer data-domain="dave.levine.io" data-api="/data/api/event" src="/data/js/script.js"></script>

          {/* Ackee tracking script */}
          <script async src="https://stats.levine.io/script2.js" data-ackee-server="https://stats.levine.io" data-ackee-domain-id="bd604f8b-c80a-42d7-8d7c-ab14e34208ce"></script>

          {/* Preload and load CSS asynchronously */}
          <link rel="preload" href="/fonts/googlefonts/google-fonts.css" as="style" />
          <link rel="stylesheet" href="/fonts/googlefonts/google-fonts.css" />
          <link rel="preload" href="/fonts/all.min.css" as="style" />
          <link rel="stylesheet" href="/fonts/all.min.css" />
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

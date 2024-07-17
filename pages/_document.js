import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* Reference to manifest.json on the same origin */}
          <link rel="manifest" href="/manifest.json" />

          {/* Single favicon.ico with multiple sizes */}
          <link rel="icon" type="image/x-icon" href="https://cdn.levine.io/uploads/portfolio/public/images/favicon/favicon.ico" />
          
          {/* Plausible tracking script */}
          <script async data-domain="dave.levine.io" data-api="/data/api/event" src="/data/js/script.js"></script>

          {/* Preconnect to external resources */}
          <link rel="preconnect" href="https://cdn.levine.io" crossorigin />

          {/* Preload and load CSS files */}
          <link rel="preload" href="https://cdn.levine.io/uploads/portfolio/public/fonts/googlefonts/google-fonts.css" as="style" crossorigin />
          <link rel="stylesheet" href="https://cdn.levine.io/uploads/portfolio/public/fonts/googlefonts/google-fonts.css" />
          <link rel="preload" href="https://cdn.levine.io/uploads/portfolio/public/fonts/webfonts/custom-fontawesome.css" as="style" crossorigin />
          <link rel="stylesheet" href="https://cdn.levine.io/uploads/portfolio/public/fonts/webfonts/custom-fontawesome.css" />
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

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />

          <link rel="icon" type="image/x-icon" href="https://cdn.levine.io/uploads/portfolio/public/images/favicon/favicon.ico" />

          <meta name="description" content="Dave Levine's portfolio website" />
          <meta name="author" content="Dave Levine" />

          <link rel="preconnect" href="https://cdn.levine.io" />
          <link rel="dns-prefetch" href="https://cdn.levine.io" />

          <link
            rel="preload"
            href="https://cdn.levine.io/uploads/portfolio/public/fonts/googlefonts/google-fonts.css"
            as="style"
          />
          <link
            rel="preload"
            href="https://cdn.levine.io/uploads/portfolio/public/fonts/webfonts/custom-fontawesome.css"
            as="style"
          />
          <link
            rel="stylesheet"
            href="https://cdn.levine.io/uploads/portfolio/public/fonts/googlefonts/google-fonts.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.levine.io/uploads/portfolio/public/fonts/webfonts/custom-fontawesome.css"
          />
          <link
            rel="preload"
            href="https://cdn.levine.io/uploads/portfolio/public/images/profile-pic-1.webp"
            as="image"
          />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* Plausible tracking script */}
          <script defer data-domain="dave.levine.io" data-api="/data/api/event" src="/data/js/script.js" async></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;

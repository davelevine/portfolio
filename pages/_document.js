import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          {/* Link to locally hosted Google Fonts CSS */}
          <link
            rel='stylesheet'
            href='/fonts/googlefonts/google-fonts.css' // Path to locally hosted Google Fonts CSS
          />

          {/* Link to locally hosted FontAwesome CSS */}
          <link
            rel='stylesheet'
            href='/fonts/all.min.css' // Path to locally hosted FontAwesome CSS
          />

          <style>{`
            @font-face {
              font-family: "Font Awesome 6 Free";
              src: url('/webfonts/fa-solid-900.woff2') format('woff2'),
                   url('/webfonts/fa-solid-900.ttf') format('truetype');
              font-weight: 900;
              font-style: normal;
            }

            @font-face {
              font-family: "Font Awesome 6 Brands";
              src: url('/webfonts/fa-brands-400.woff2') format('woff2'),
                   url('/webfonts/fa-brands-400.ttf') format('truetype');
              font-weight: 400;
              font-style: normal;
            }
          `}
          </style>
          {/* Plausible tracking script */}
          <script defer data-domain="www.davelevine.io" data-api="/data/api/event" src="/data/js/script.js"></script>
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

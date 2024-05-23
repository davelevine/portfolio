import Document, { Html, Head, Main, NextScript } from 'next/document';
// import { fontawesomeSubset } from "fontawesome-subset";

class MyDocument extends Document {
  render() {
    // Font Awesome Subset
    {/* fontawesomeSubset(
      {
        brands: ["github", "linkedin"],
        solid: ["globe", "moon", "sun", "envelope", "envelope-open", "xmark", "link", "circle-info"],
      },
      "public/fonts/webfonts",
      {
        package: "free",
      }
    );
    */}

    return (
      <Html lang='en'>
        <Head>
          {/* Reference to manifest.json */}
          <link rel="manifest" href="/manifest.json" />

          {/* Single favicon.ico with multiple sizes */}
          <link rel="icon" type="image/x-icon" href="/images/favicon/favicon.ico" />
          
          {/* Plausible tracking script */}
          <script defer data-domain="dave.levine.io" data-api="/data/api/event" src="/data/js/script.js"></script>

          {/* Dynamically load CSS asynchronously */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function loadCSS(href, integrity) {
                  var link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = href;
                  link.type = 'text/css';
                  link.media = 'all';
                  link.crossOrigin = 'anonymous';
                  link.referrerPolicy = 'no-referrer';
                  if (integrity) {
                    link.integrity = integrity;
                  }
                  document.head.appendChild(link);
                }

                loadCSS('/fonts/googlefonts/google-fonts.css');
                loadCSS('/fonts/all.min.css')
              `,
            }}
          />

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

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
          <script defer data-domain="www.davelevine.io" data-api="/data/api/event" src="/data/js/script.js"></script>

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
                loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css', 'sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==');
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
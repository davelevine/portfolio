import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Helmet } from 'react-helmet';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <Helmet>
            <title>Dave Levine - Solutions Engineer</title>
            {/* Add other head elements here */}
          </Helmet>
          
          {/* Link to locally hosted Google Fonts CSS */}
          <link
            rel='stylesheet'
            href='/fonts/googlefonts/google-fonts.css' // Path to locally hosted Google Fonts CSS
          />

          {/* Link to locally hosted FontAwesome CSS (all.min.css) */}
          <link
            rel='stylesheet'
            href='/fonts/all.min.css' // Adjust the path as needed
          />

          {/* No need for custom @font-face declarations for Font Awesome */}
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

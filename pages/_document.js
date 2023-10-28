import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='anonymous'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&family=Poppins&display=swap'
            rel='stylesheet'
          />

          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'
            integrity='sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=='
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
          <script defer data-domain="dave.levine.org" data-api="/data/api/event" src="/data/js/script.js"></script>

          <script defer data-domain="www.davelevine.io" data-api="/data/api/event" src="/data/js/script.js"></script>

          <script defer data-domain="www.davidlevine.com" data-api="/data/api/event" src="/data/js/script.js"></script>
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

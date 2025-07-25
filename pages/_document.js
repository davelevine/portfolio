import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="https://cdn.levine.io/uploads/portfolio/public/images/favicon/favicon.ico" />
          <link rel="shortcut icon" href="https://cdn.levine.io/uploads/portfolio/public/images/favicon/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.levine.io/uploads/portfolio/public/images/favicon/apple-touch-icon.png" />

          <meta name="description" content="Dave Levine's Portfolio" />
          <meta name="author" content="Dave Levine" />

          <link rel="preconnect" href="https://cdn.levine.io" />
          <link rel="dns-prefetch" href="https://cdn.levine.io" />
          <link rel="preconnect" href="https://stats.levine.io" />
          <link rel="dns-prefetch" href="https://stats.levine.io" />

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

          {/* RSS Feed Link */}
          <link rel="alternate" type="application/rss+xml" title="RSS Feed for Dave Levine's Blog" href="/rss.xml" />

          {/* Preload the appropriate LCP images */}
          {this.props.lcpImages?.map((src, index) => (
            <link key={index} rel="preload" href={src} as="image" fetchpriority="high" />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Umami tracking script */}
          <script defer src="https://stats.levine.io/script.js" data-website-id="6c39846d-da66-4f2d-91b8-79f01360682d"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;

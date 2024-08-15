import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Extract LCP images, respecting variant requirements
    const lcpImages = extractLCPImages(ctx.renderPage().html);

    return { ...initialProps, lcpImages };
  }

  render() {
    const { lcpImages } = this.props;

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

          {/* Preload the appropriate LCP images */}
          {lcpImages.map((src, index) => (
            <link key={index} rel="preload" href={src} as="image" fetchpriority="high" />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Plausible tracking script */}
          <script defer data-domain="dave.levine.io" data-api="/data/api/event" src="/data/js/script.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;

// Function to extract LCP images using regex
function extractLCPImages(html) {
  const regex = /<Image[^>]*\s+src=["']([^"']+)["']/g;
  const matches = [];
  let match;

  // Get the screen width to determine the correct variant to preload
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200; // Fallback to a typical desktop width

  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    let preloadUrl;

    if (isMultiVariantImage(src)) {
      // Handle multi-variant images based on screen width
      preloadUrl = screenWidth > 768 ? `${src}&w=1080&q=75` : `${src}&w=640&q=75`;
    } else {
      // For single-variant images, preload the single src directly
      preloadUrl = src;
    }
    matches.push(preloadUrl);
  }
  return matches;
}

// Helper function to identify multi-variant images
function isMultiVariantImage(src) {
  const multiVariantImages = [
    'profile-pic-1.webp', // Add specific image URLs or patterns here
    // Add other multi-variant images as needed
  ];
  return multiVariantImages.some((image) => src.includes(image));
}

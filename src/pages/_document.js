import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#0f172a" />
          <meta
            name="description"
            content="Media lists for books and movies discussed on Very Bad Wizards"
          />
          <meta property="og:type" content="Very Bad Media" />
          <meta property="og:url" content="verybad.media" />
          <meta property="og:title" content="Very Bad Media" />
          <meta
            property="og:description"
            content="Media lists for books and movies discussed on Very Bad Wizards"
          />
          <meta
            property="og:image"
            content="https://verybad.meda/public/hero.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="verybad.media" />
          <meta property="twitter:title" content="Very Bad Media" />
          <meta
            property="twitter:description"
            content="Media lists for books and movies discussed on Very Bad Wizards"
          />
          <meta
            property="twitter:image"
            content="https://verybad.meda/public/hero.png"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
            rel="stylesheet"
          />
          <script
            defer
            src="https://umami.tagweb.dev/script.js"
            data-website-id="6027c074-3fb6-458b-a0d0-10e548f0a7c0"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

import Head from "next/head";

export default function LayoutBase({ children }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover, user-scalable=no"
        ></meta>
        <meta name="description" content=""></meta>
        <meta name="author" content="Armin Esmaeili"></meta>
        <title>بفرستو</title>

        <link rel="apple-touch-icon" href="/icons/logo-192x.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/logo-192x.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/logo-192x.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/logo-192x.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-512x.png"
          sizes="640x1136"
        />
      </Head>

      <main className="pink-theme">
        <div className="container">{children}</div>
      </main>
    </>
  );
}

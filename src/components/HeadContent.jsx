import Head from "next/head";

const HeadContent = () => {
  return (
    <Head>
      <meta name="application-name" content="بفرستو!" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="بفرستو" />
      <meta name="description" content="سفارش آنلاین از فروشگاه ها با بفرستو" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />

      <meta name="twitter:card" content="خرید آنلاین از فروشگاه های محل شما" />
      <meta name="twitter:url" content="https://befresto.ir" />
      <meta name="twitter:title" content="بفرستو!" />
      <meta name="twitter:description" content="خرید آنلاین با بفرستو" />
      <meta
        name="twitter:image"
        content="https://befresto.ir/icons/logo-192x.png"
      />
      <meta name="twitter:creator" content="@befresto" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="بفرستو!" />
      <meta property="og:description" content="خرید آنلاین با بفرستو" />
      <meta property="og:site_name" content="بفرستو" />
      <meta property="og:url" content="https://befresto.ir" />
      <meta
        property="og:image"
        content="https://befresto.ir/icons/logo-512x.png"
      />
    </Head>
  );
};
export default HeadContent;

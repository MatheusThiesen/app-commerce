import Head from "next/head";

const Fallback = () => (
  <>
    <Head>
      <title>Offline | App Alpar do Brasil</title>
    </Head>
    <h1>Esta é uma página de fallback off-line</h1>
    <h2>When offline, any page route will fallback to this page</h2>
  </>
);

export default Fallback;

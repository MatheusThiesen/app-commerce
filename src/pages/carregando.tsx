import Head from "next/head";
import { useRouter } from "next/router";

import { Loading } from "@/components/loading";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("inicio");
    }, 1500);
  }, []);

  return (
    <>
      <Head>
        <title>Carregando... | App Alpar do Brasil</title>
      </Head>

      <div className="h-screen w-screen flex justify-center items-center">
        <Loading />
      </div>
    </>
  );
}

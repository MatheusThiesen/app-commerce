import { Box, Skeleton, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "../service/apiClient";

import { Product } from "@/components/Product";
import { Search } from "@/components/Search";
import { ShoppingButton } from "@/components/ShoppingButton";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useStore } from "@/contexts/StoreContext";
import {
  CLIENT_EMAILS_ACCEPT_STORE,
  defaultNoImage,
  spaceImages,
} from "@/global/parameters";
import { useHomeData } from "@/hooks/queries/useHomeData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BannerCarousel } from "../components/BannerCarousel";
import { Cart } from "../components/Cart";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { useAuth } from "../contexts/AuthContext";
import { useBanners } from "../hooks/queries/useBanners";

export default function Home() {
  const { data, isLoading: isLoadingBanners } = useBanners();
  const router = useRouter();
  const { user } = useAuth();
  const { data: homeData, isLoading: isLoadingHomeData } = useHomeData();

  const [search, setSearch] = useState<string>(() => {
    return router.query.search ? String(router.query.search) : "";
  });

  const { totalItems } = useStore();
  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  async function handlePressBanner(bannerId: string) {
    const find = data?.banners.find((f) => f.id === bannerId);

    if (find) {
      router.push("/produtos" + `?banners=${find.titulo}|${find.id}`);
      await api.patch(`/panel/banners/click/${find.id}`);
    }
  }

  useEffect(() => {
    if (search) router.push(`/produtos/?search=${search}`);
  }, [search]);

  return (
    <>
      <Head>
        <title>Inicio | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        Right={
          user.eCliente &&
          CLIENT_EMAILS_ACCEPT_STORE.includes(user.email) && (
            <ShoppingButton
              qtdItens={totalItems}
              onClick={onOpenOrder}
              disabledTitle
            />
          )
        }
        Center={
          <Box width={"100%"} paddingX={["0.5rem", "0.5rem", "0.5rem", "0"]}>
            <Search
              size={"md"}
              handleChangeSearch={(search) => {
                setSearch(search);
              }}
              currentSearch={search}
              placeholder="Buscar na Alpar do Brasil por produtos"
            />
          </Box>
        }
      />

      {isLoadingHomeData || isLoadingBanners ? (
        <SkeletonLoading />
      ) : (
        <div className="w-full flex justify-center flex-col overflow-hidden">
          {(data?.banners.length ?? 0) > 0 && (
            <Box w="100%">
              <BannerCarousel
                h="30rem"
                display={["none", "none", "none", "flex"]}
                onPress={handlePressBanner}
                banners={
                  data?.banners.map((banner) => ({
                    id: banner.id,
                    name: banner.titulo,
                    uri: banner.imagemDesktop.url,
                  })) ?? []
                }
              />
              <BannerCarousel
                h="27rem"
                display={["flex", "flex", "flex", "none"]}
                onPress={handlePressBanner}
                banners={
                  data?.banners.map((banner) => ({
                    id: banner.id,
                    name: banner.titulo,
                    uri: banner.imagemMobile.url,
                  })) ?? []
                }
              />
            </Box>
          )}

          <div className="w-full flex justify-center ">
            <div className="w-full max-w-screen-xl px-4 py-12">
              <h3 className="text-2xl font-light mb-4">Produtos em alta</h3>

              <ScrollArea className="w-full">
                <div className="flex w-max space-x-4 ">
                  {homeData?.products?.map((product) => (
                    <div key={product.codigo} className="shrink-0 w-48">
                      <Product
                        href="produtos"
                        product={{
                          cod: product.codigo,
                          name: product.descricao,
                          descriptionAdditional: product.descricaoAdicional,
                          reference: product.referencia,
                          amount: "PDV " + product.precoVendaFormat ?? "-",
                          uri: `${spaceImages}/Produtos/${
                            product?.imagemPreview
                              ? product.imagemPreview
                              : product.referencia + "_01"
                          }_smaller`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <div className="relative w-full bg-[url('/assets/background-categories.png')] bg-cover bg-center h-[38rem] p-10 backdrop-brightness-50">
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 flex flex-col">
              <h3 className="text-2xl font-bold text-white text-center">
                COMPRAR POR CATEGORIA
              </h3>

              <div className="flex mt-8 justify-around w-full">
                <div className="flex flex-col gap-y-2">
                  {homeData?.lines?.slice(0, 10)?.map((item) => (
                    <Link
                      href={`/produtos?linhaCodigo=${item.descricao}|${item.codigo}`}
                    >
                      <Button
                        className="text-white truncate w-48 uppercase rounded-none px-2 md:px-10 flex justify-start font-bold"
                        variant="ghost"
                      >
                        {item.descricao}
                      </Button>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-y-2">
                  {homeData?.lines
                    ?.slice(
                      10,
                      (homeData?.lines?.slice(21, 30).length ?? 0) <= 0
                        ? 19
                        : 20
                    )
                    ?.map((item) => (
                      <Link
                        href={`/produtos?linhaCodigo=${item.descricao}|${item.codigo}`}
                      >
                        <Button
                          className="text-white truncate w-48 uppercase rounded-none px-2 md:px-10 flex justify-start font-bold"
                          variant="ghost"
                        >
                          {item.descricao}
                        </Button>
                      </Link>
                    ))}

                  {(homeData?.lines?.slice(21, 30).length ?? 0) <= 0 && (
                    <Link href={`/produtos`}>
                      <Button
                        className="text-white truncate w-48 uppercase rounded-none px-2 md:px-10 flex justify-start font-bold"
                        variant="ghost"
                      >
                        ...MAIS
                      </Button>
                    </Link>
                  )}
                </div>

                {(homeData?.lines?.slice(21, 30).length ?? 0) > 0 && (
                  <div className="flex-col gap-y-2 hidden  sm:flex">
                    {homeData?.lines?.slice(21, 30)?.map((item) => (
                      <Link
                        href={`/produtos?linhaCodigo=${item.descricao}|${item.codigo}`}
                      >
                        <Button
                          className="text-white truncate w-48 uppercase rounded-none px-2 md:px-10 flex justify-start font-bold"
                          variant="ghost"
                        >
                          {item.descricao}
                        </Button>
                      </Link>
                    ))}
                    <Link href={`/produtos`}>
                      <Button
                        className="text-white truncate w-48 uppercase rounded-none px-2 md:px-10 flex justify-start font-bold"
                        variant="ghost"
                      >
                        ...MAIS
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center ">
            <div className="w-full max-w-screen-xl px-4 py-12 flex flex-col items-start">
              <h3 className="text-2xl font-light mb-4">Marcas</h3>
              <ScrollArea className="w-full pb-3">
                <div className="flex w-max space-x-4 ">
                  {homeData?.brands.map((brand) => (
                    <div
                      key={brand.codigo}
                      className="shrink-0 w-36 md:w-64 flex justify-center items-end px-4 md:px-16"
                    >
                      <Link
                        href={`/produtos?marcaCodigo=${brand.descricao}|${brand.codigo}`}
                      >
                        <Image
                          src={brand.url ?? defaultNoImage}
                          alt={`logo by ${brand.descricao}`}
                          className="h-fit w-fit object-cover"
                          width={300}
                          height={400}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>

          <div className="w-full flex justify-center ">
            <div className="max-w-screen-xl w-full px-4 py-6">
              <h3 className="text-2xl font-bold text-center">
                Para quem esta comprando
              </h3>

              <div className="flex justify-around mt-10 gap-x-6">
                <Link href="/produtos?generoCodigo=Feminino|2">
                  <div className="relative flex justify-center items-end">
                    <img
                      src="/assets/woman.jpg"
                      alt="woman"
                      className="z-0 brightness-75"
                    />

                    <div className="absolute z-10 w-full h-full flex justify-center items-end opacity-0 bg-black/50 hover:opacity-100 transition-all duration-800">
                      <span className="text-2xl mb-10 font-bold text-white text-center">
                        FEMININO
                      </span>
                    </div>
                  </div>
                </Link>

                <Link href="/produtos?generoCodigo=Masculino|1">
                  <div className="relative flex justify-center items-end">
                    <img
                      src="/assets/man.jpg"
                      alt="man"
                      className="brightness-75"
                    />
                    <div className="absolute z-10 w-full h-full flex justify-center items-end opacity-0 bg-black/50 hover:opacity-100 transition-all duration-800">
                      <span className="text-2xl mb-10 font-bold text-white text-center">
                        MASCULINO
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Cart isOpen={isOpenOrder} onClose={onCloseOrder} />
    </>
  );
}

function SkeletonLoading() {
  return (
    <div className="w-full flex justify-center flex-col overflow-hidden">
      <Skeleton className="w-full h-[30rem] " />;
      <div className="w-full flex justify-center ">
        <div className="w-full max-w-screen-xl px-4 py-12">
          <h3 className="text-2xl font-light mb-4">Produtos em alta</h3>

          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 ">
              <Skeleton className="w-48 h-80 rounded-md" />
              <Skeleton className="w-48 h-80 rounded-md" />
              <Skeleton className="w-48 h-80 rounded-md" />
              <Skeleton className="w-48 h-80 rounded-md" />
              <Skeleton className="w-48 h-80 rounded-md" />
              <Skeleton className="w-48 h-80 rounded-md" />
            </div>
          </ScrollArea>
        </div>
      </div>
      <Skeleton className="w-full h-[38rem] " />;
      <div className="w-full flex justify-center ">
        <div className="w-full max-w-screen-xl px-4 py-12">
          <h3 className="text-2xl font-light mb-4">Marcas</h3>

          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 ">
              <Skeleton className="w-48 h-48 rounded-lg" />
              <Skeleton className="w-48 h-48 rounded-lg" />
              <Skeleton className="w-48 h-48 rounded-lg" />
              <Skeleton className="w-48 h-48 rounded-lg" />
              <Skeleton className="w-48 h-48 rounded-lg" />
              <Skeleton className="w-48 h-48 rounded-lg" />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

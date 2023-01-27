import { Box, BoxProps, Image } from "@chakra-ui/react";
import { Lazy, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./style.module.scss";

interface Banner {
  id: string;
  uri: string;
  name: string;
}

interface BannerCarouselProps extends BoxProps {
  banners: Banner[];
}

export function ProductCarousel({ banners, ...rest }: BannerCarouselProps) {
  return (
    <Box bg="#fff" {...rest}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Lazy]}
        className={styles["container-carousel-product"]}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} id={banner.id}>
            <Image
              background="#fff"
              boxSize="full"
              objectFit="contain"
              alt={banner.name}
              src={banner.uri}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src =
                  "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

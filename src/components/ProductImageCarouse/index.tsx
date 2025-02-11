import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { Box, BoxProps, Image } from "@chakra-ui/react";
import { defaultNoImage } from "../../global/parameters";
import styles from "./style.module.scss";

interface Banner {
  id: string;
  uri: string;
  name: string;
}

interface BannerCarouselProps extends BoxProps {
  banners: Banner[];
}

export function ProductImageCarouse({ banners, ...rest }: BannerCarouselProps) {
  return (
    <Box bg="#fff" userSelect="none" {...rest}>
      <Swiper
        spaceBetween={50}
        centeredSlides={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        rewind={true}
        modules={[Pagination, Navigation]}
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
                currentTarget.src = defaultNoImage;
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

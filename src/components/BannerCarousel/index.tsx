import { Box, BoxProps, Image } from "@chakra-ui/react";
import { Autoplay, Lazy, Navigation, Pagination } from "swiper";
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

export function BannerCarousel({ banners, ...rest }: BannerCarouselProps) {
  return (
    <Box h={300} {...rest}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, Lazy]}
        className={styles["container-carousel"]}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} id={banner.id}>
            <Image
              boxSize="full"
              objectFit="cover"
              alt={banner.name}
              src={banner.uri}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
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
  onPress?: (id: string) => void;
}

export function BannerCarousel({
  banners,
  onPress,
  ...rest
}: BannerCarouselProps) {
  return (
    <Box h={400} {...rest}>
      <Swiper
        cssMode={true}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles["container-carousel"]}
      >
        {banners.map((banner) => (
          <SwiperSlide
            key={banner.id}
            id={banner.id}
            onClick={() => {
              if (onPress) onPress(banner.id);
            }}
            style={{
              width: "100vw",
            }}
          >
            <Image
              className="bg-white"
              boxSize="full"
              objectFit="cover"
              cursor={onPress ? "pointer" : undefined}
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

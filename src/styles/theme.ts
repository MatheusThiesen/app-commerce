import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { GlobalStyleProps, mode } from "@chakra-ui/theme-tools";

export const themeColors = {
  primary: "#1F2029",
  "primary.hover": "#353646",
  background: "#D1D2DC",
};

export const theme: ThemeConfig = extendTheme({
  initialColorMode: "light",
  colors: {
    ...themeColors,

    gray: {
      "900": "#181B23",
      "800": "#1F2029",
      "700": "#353646",
      "600": "#4B4D63",
      "500": "#616480",
      "400": "#797D9A",
      "300": "#9699B0",
      "200": "#B3B5C6",
      "100": "#D1D2DC",
      "50": "#EEEEF2",
    },
    red: {
      "500": "#da2d3a",
    },
    blue: {
      "400": "#007aff",
    },
  },
  fonts: {
    heaing: "'Roboto', sans-serif",
    body: "'Roboto', sans-serif",
  },
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: mode("background", "gray.900")(props),
        color: props.colorMode === "dark" ? "gray.50" : "gray.900",
        overflow: "hidden",
      },
    }),
  },
});

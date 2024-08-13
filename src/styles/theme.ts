import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { GlobalStyleProps, mode } from "@chakra-ui/theme-tools";

export const themeColors = {
  primary: "rgb(17 24 39)",
  "primary.hover": "rgb(31 41 55)",
  background: "rgb(244, 246, 250)",
};

export const theme: ThemeConfig = extendTheme({
  initialColorMode: "light",
  colors: {
    ...themeColors,

    gray: {
      "900": "rgb(17 24 39)",
      "800": "rgb(31 41 55)",
      "700": "rgb(55 65 81)",
      "600": "rgb(75 85 99)",
      "500": "rgb(107 114 128)",
      "400": "rgb(156 163 175)",
      "300": "rgb(209 213 219)",
      "200": "rgb(209 213 219)",
      "100": "rgb(244, 246, 250)",
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

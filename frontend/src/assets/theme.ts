import { extendTheme } from "@chakra-ui/react";
import "@fontsource/karma/600.css";
import "@fontsource-variable/outfit";
import { solidButtonTheme } from "./buttonTheme";

const theme = extendTheme({
  fonts: {
    heading: `'Outfit', sans-serif`,
    body: `'Outfit', sans-serif`,
  },
  components: { Button: solidButtonTheme },
});

export default theme;

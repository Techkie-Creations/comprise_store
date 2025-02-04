import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const solidButton = defineStyle({
  backgroundColor: "black",
  color: "#EEEEEE",
  variant: "solid",
  fontSize: "1rem",
  border: "1px solid black",
  _hover: { backgroundColor: "#EEEEEE", color: "black" },
});

const hollowButton = defineStyle({
  backgroundColor: "#EEEEEE",
  color: "black",
  variant: "solid",
  fontSize: "1rem",
  border: "1px solid black",
  _hover: { backgroundColor: "black", color: "#EEEEEE" },
});

export const solidButtonTheme = defineStyleConfig({
  variants: { solidButton, hollowButton },
});
// export const hollowButtonTheme = defineStyleConfig({
//   variants: { hollowButton },
// });

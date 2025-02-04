import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { Company, Services } from "../utils/FooterDeps";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <Box mt={7} px={3} py={5} backgroundColor={"black"} color={"#EEEEEE"}>
      <Text
        fontSize={"2rem"}
        fontFamily={`'Karma', serif`}
        textAlign={"center"}
      >
        <NavLink to="/">Comprise Store</NavLink>
      </Text>
      <Grid
        gridTemplateColumns={"repeat(3, 1fr)"}
        justifyItems={"center"}
        my={7}
      >
        <Box>
          <Text my={2}>Help</Text>
          <Text fontSize={".8rem"} my={1} _hover={{ textDecor: "underline" }}>
            <NavLink to={"/help/"}>FAQs</NavLink>
          </Text>
          <Text fontSize={".8rem"} my={1} _hover={{ textDecor: "underline" }}>
            <NavLink to={"/help/"}>Product Care</NavLink>
          </Text>
          <Text fontSize={".8rem"} _hover={{ textDecor: "underline" }}>
            <NavLink to={"/help/contactUs"}>Contact Us</NavLink>
          </Text>
          <Text fontSize={".8rem"}>helpme@comprise.com</Text>
          <Text fontSize={".8rem"}>+27 69 515 1499</Text>
        </Box>
        <Box>
          <Text my={2}>Services</Text>
          {Services.map((service, key) => (
            <Text
              key={key}
              fontSize={".8rem"}
              _hover={{ textDecor: "underline" }}
              my={1}
            >
              <NavLink to={`/services${service.to}`}>{service.text}</NavLink>
            </Text>
          ))}
        </Box>
        <Box>
          <Text my={2}>Company</Text>
          {Company.map((comp, key) => (
            <Text
              key={key}
              fontSize={".8rem"}
              _hover={{ textDecor: "underline" }}
              my={1}
            >
              <NavLink to={`/company${comp.to}`}>{comp.text}</NavLink>
            </Text>
          ))}
        </Box>
      </Grid>
      <Grid
        gridTemplateColumns={"repeat(3, 1fr)"}
        justifyItems={"center"}
        my={7}
      >
        <Flex alignItems={"center"} gap={2}>
          <Text>Follow Us: </Text>
          <FaFacebookF />
          <FaTwitter />
          <BsInstagram />
        </Flex>
        <Box></Box>
        <Text fontSize={".8rem"}>
          Comprise Store &copy; 2024. All rights reserved.
        </Text>
      </Grid>
    </Box>
  );
};

export default Footer;

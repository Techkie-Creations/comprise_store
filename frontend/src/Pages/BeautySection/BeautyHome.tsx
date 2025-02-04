import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Beauty from "./Beauty";
import Skincare from "./Skincare";
import { useSearchParams } from "react-router-dom";

const BeautyHome = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    category: "Beauty",
  });

  const [category, setCategory] = useState(searchParams.get("category"));

  return (
    <Box p={4}>
      <Flex alignItems={"center"} justify={"space-between"}>
        <Heading>{category}</Heading>
        <InputGroup w={"17rem"}>
          <Input
            type="text"
            placeholder="search"
            borderColor={"grey"}
            _hover={{ borderColor: "black" }}
            _focusVisible={{
              zIndex: 1,
              borderColor: "black",
              boxShadow: "0 0 0 1px black",
            }}
          />
          <InputRightElement>
            <FaSearch />
          </InputRightElement>
        </InputGroup>
      </Flex>
      {/* Category Choices */}
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        gap={"1rem"}
        mt={10}
      >
        <Button
          onClick={() => {
            setCategory("Beauty");
            setSearchParams({ category: "Beauty" });
          }}
          backgroundColor={category === "Beauty" ? "black" : "#EEEEEE"}
          border={category === "Beauty" ? "" : "1px solid black"}
          color={category === "Beauty" ? "#EEEEEE" : "black"}
          transition={"100ms ease-in-out"}
          _hover={
            category === "Beauty"
              ? { cursor: "pointer" }
              : {
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  color: "#EEEEEE",
                  cursor: "pointer",
                }
          }
          isDisabled={category === "Beauty"}
        >
          Beauty
        </Button>
        <Button
          onClick={() => {
            setCategory("Skincare");
            setSearchParams({ category: "Skincare" });
          }}
          backgroundColor={category === "Skincare" ? "black" : "#EEEEEE"}
          border={category === "Skincare" ? "" : "1px solid black"}
          color={category === "Skincare" ? "#EEEEEE" : "black"}
          transition={"100ms ease-in-out"}
          _hover={
            category === "Skincare"
              ? { cursor: "pointer" }
              : {
                  backgroundColor: "rgba(0, 0, 0, 0.75)",
                  color: "#EEEEEE",
                  cursor: "pointer",
                }
          }
          isDisabled={category === "Skincare"}
        >
          Skincare
        </Button>
      </Flex>
      {category == "Beauty" ? <Beauty /> : <Skincare />}
    </Box>
  );
};

export default BeautyHome;

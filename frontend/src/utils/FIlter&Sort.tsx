import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { FilterObjects } from "./Types";
import { FaRegFaceDizzy } from "react-icons/fa6";

interface Filter {
  props: FilterObjects[];
  handleFilterChange: (data: string, label: string) => void;
  checkedBox: string[];
  reset: () => void;
}

export const Filter: FC<Filter> = ({
  props,
  handleFilterChange,
  checkedBox,
  reset,
}): JSX.Element => {
  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Text fontWeight={600}>Filter By: </Text>
        {checkedBox.length > 0 && (
          <Button
            onClick={reset}
            border={"1px solid black"}
            backgroundColor={"#EEEEEE"}
            size={"sm"}
          >
            {" "}
            Reset
          </Button>
        )}
      </Flex>
      {props.length === 0 ? (
        <Flex
          direction={"column"}
          w={"11rem"}
          alignItems={"center"}
          mt={"4rem"}
          gap={2}
        >
          <Spinner width={"4rem"} h={"4rem"} />
          <Text as={"p"}>Loading Filters...</Text>
        </Flex>
      ) : (
        <>
          {props.map((prop, key) => (
            <VStack
              key={key}
              align={"stretch"}
              gap={".8rem"}
              width={"11rem"}
              mt={4}
            >
              <Accordion allowMultiple defaultIndex={[key]}>
                <AccordionItem>
                  <h3>
                    <AccordionButton
                      fontSize={".9rem"}
                      w={"100%"}
                      backgroundColor={"black"}
                      color={"#EEEEEE"}
                      _hover={{ backgroundColor: "black", color: "#EEEEEE" }}
                      mb={".5rem"}
                      borderRadius={".3rem"}
                    >
                      <Flex
                        w={"100%"}
                        justify={"space-between"}
                        align={"center"}
                      >
                        {prop.label}
                        <AccordionIcon />
                      </Flex>
                    </AccordionButton>
                  </h3>
                  <AccordionPanel p={0}>
                    <VStack
                      border={"1px solid rgba(0, 0, 0, 0.7)"}
                      p={2}
                      align={"stretch"}
                      m={0}
                      height={"max-content"}
                      maxH={"15rem"}
                      overflowY={"auto"}
                      overflowX={"hidden"}
                      borderRadius={".3rem"}
                    >
                      {prop.data.map((info, key) => (
                        <Checkbox
                          value={info}
                          onChange={(e) =>
                            handleFilterChange(e.target.value, prop.label)
                          }
                          isChecked={checkedBox.indexOf(info) >= 0}
                          border={"black"}
                          _checked={{
                            "& .chakra-checkbox__control": {
                              background: "black",
                              borderColor: "black",
                            },
                            "& .css-1ydjfm6[aria-checked=true]:hover, .css-1ydjfm6[data-checked]:hover":
                              {
                                background: "rgba(0, 0, 0, 0.75)",
                                borderColor: "black",
                              },
                            "& .css-1ydjfm6:focus-visible": {
                              boxShadow: "0 0 0 3px black",
                            },
                          }}
                          key={key}
                        >
                          <Text fontSize={".8rem"}>{info}</Text>
                        </Checkbox>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          ))}
        </>
      )}
    </Box>
  );
};

export const EmptyFilterResults = () => {
  return (
    <Flex
      direction={"column"}
      w={"11rem"}
      alignItems={"center"}
      mt={"4rem"}
      gap={2}
    >
      <FaRegFaceDizzy size={250} />
      <Text as={"p"}>No matching products found.</Text>
    </Flex>
  );
};

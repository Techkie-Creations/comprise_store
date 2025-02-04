import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Image,
  Text,
  Heading,
  VStack,
  Collapse,
  Tooltip,
} from "@chakra-ui/react";
import { FC, useContext, useState } from "react";
import { BeautyType, SkincareType } from "../../utils/Types";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { IoBagOutline, IoCartOutline } from "react-icons/io5";
import { AuthContext } from "../../context/AuthContext";
import UserModal from "../../components/UserModal";

interface Beauty {
  product: BeautyType[];
}

const Vstack = {
  w: "50%",
  justify: "space-between",
  align: "stretch",
};

export const BeautyProduct: FC<Beauty> = ({ product }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<string>("");

  const context = useContext(AuthContext);

  return (
    <Box p={4}>
      <Button
        variant={"hollowButton"}
        leftIcon={<IoIosArrowBack size={"1.3rem"} />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      {product.map((product, key) => (
        <Flex mt={8} gap={"1rem"} key={key}>
          <Image
            src={product.api_featured_image}
            alt={product.name}
            // width={"50%"}
            boxSize={"30rem"}
          />
          <VStack {...Vstack}>
            <Flex justify={"space-between"}>
              <Heading size={"lg"}>{product.name}</Heading>

              {context.user.userId ? (
                <Button
                  variant={"solidButton"}
                  fontSize={".8rem"}
                  leftIcon={<IoBagOutline fontSize={"1.3rem"} />}
                >
                  Wish Bag
                </Button>
              ) : (
                <UserModal
                  fontSize=".8rem"
                  text="WishBag"
                  icon={<IoBagOutline />}
                  btn_text={"Wish Bag"}
                  variant="hollowButton"
                />
              )}
            </Flex>
            {product.description.length <= 198 ? (
              <Text fontStyle={"italic"} noOfLines={5}>
                {product.description}
              </Text>
            ) : (
              <>
                <Collapse startingHeight={20} in={show}>
                  {product.description}
                </Collapse>
                <Button
                  size="sm"
                  onClick={() => setShow(!show)}
                  mt="1rem"
                  w={"8rem"}
                  variant={"hollowButton"}
                >
                  Show {show ? "Less" : "More"}
                </Button>
              </>
            )}

            {product.product_colors.length > 0 && (
              <Box>
                <Text fontWeight={600} mb={2}>
                  Available Colors:
                </Text>
                <SimpleGrid columns={{ base: 3, md: 5, lg: 9 }} spacingY={1}>
                  {product.product_colors.map((color, idx) => (
                    <Tooltip hasArrow label={color.colour_name} key={idx}>
                      <Flex
                        // p={0.2}
                        align={"center"}
                        justify={"center"}
                        w={"2.5rem"}
                        h={"2.5rem"}
                        borderRadius={"50%"}
                        _hover={{
                          cursor: "pointer",
                          border: "2px solid black",
                        }}
                        border={
                          selected == color.colour_name
                            ? "2px solid black"
                            : "1px solid grey"
                        }
                      >
                        <Box
                          _active={{ scaleY: 2 }}
                          w={"2rem"}
                          h={"2rem"}
                          borderRadius={"50%"}
                          backgroundColor={color.hex_value}
                          onClick={() => {
                            setSelected("");
                            setSelected(color.colour_name);
                          }}
                        ></Box>
                      </Flex>
                    </Tooltip>
                  ))}
                </SimpleGrid>
              </Box>
            )}
            <Text>
              <b>Price:</b> ${product.price}
            </Text>
            <Text>
              <b>Rating:</b> {product.rating ? product.rating : "Unrated"}
            </Text>
            {product.product_colors.length > 0 && selected && (
              <Text fontSize={".9rem"}>
                <b>Selected: </b> <i>{selected}</i>
              </Text>
            )}
            {context.user.userId ? (
              <Button
                variant={"solidButton"}
                leftIcon={<IoCartOutline fontSize={"1.3rem"} />}
              >
                Add to Cart
              </Button>
            ) : (
              <UserModal
                fontSize={"1rem"}
                text="Cart"
                icon={<IoCartOutline fontSize={"1.3rem"} />}
                btn_text={"Add to Cart"}
                variant="solidButton"
              />
            )}
          </VStack>
        </Flex>
      ))}
    </Box>
  );
};

interface Skincare {
  product: SkincareType[];
}

export const SkincareProduct: FC<Skincare> = ({ product }) => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const location = useLocation();
  console.log(location.pathname);

  return (
    <Box p={4}>
      <Button
        variant={"hollowButton"}
        leftIcon={<IoIosArrowBack size={"1.3rem"} />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      {product.map((product, key) => (
        <Flex mt={8} gap={"1rem"} key={key}>
          <Image
            objectFit={"contain"}
            boxSize={"27rem"}
            src={product.image}
            alt={product.name}
          />
          <VStack {...Vstack}>
            <Flex justify={"space-between"}>
              <Heading size={"lg"}>{product.name}</Heading>

              {context.user.userId ? (
                <Button
                  variant={"solidButton"}
                  fontSize={".8rem"}
                  leftIcon={<IoBagOutline fontSize={"1.3rem"} />}
                >
                  Wish Bag
                </Button>
              ) : (
                <UserModal
                  fontSize=".8rem"
                  text="WishBag"
                  icon={<IoBagOutline />}
                  btn_text={"Wish Bag"}
                  variant="hollowButton"
                />
              )}
            </Flex>
            <Text>
              <b>By: </b>
              {product.brand}
            </Text>
            <Text fontSize={".9rem"} fontStyle={"italic"}>
              {product.effects.join(", ")}
            </Text>
            <Text fontWeight={600}>Ingredients: </Text>
            {product.ingredients.join(", ").length <= 402 ? (
              <Text fontStyle={"italic"} fontSize={".9rem"}>
                {product.ingredients.join(", ")}
              </Text>
            ) : (
              <>
                <Collapse startingHeight={20} in={show}>
                  {product.ingredients.join(", ")}
                </Collapse>
                <Button
                  size="sm"
                  onClick={() => setShow(!show)}
                  mt="1rem"
                  w={"8rem"}
                  variant={"hollowButton"}
                >
                  Show {show ? "Less" : "More"}
                </Button>
              </>
            )}
            <Text>
              <b>Safety: </b>
              {product.safety}%
            </Text>
            <Text>
              <b>Price:</b> ${product.price}
            </Text>
            <Text>
              <b>Rating:</b> {product.rating ? product.rating : "Unrated"}
            </Text>
            {context.user.userId ? (
              <Button
                variant={"solidButton"}
                leftIcon={<IoCartOutline fontSize={"1.3rem"} />}
              >
                Add to Cart
              </Button>
            ) : (
              <UserModal
                fontSize={"1rem"}
                text="Cart"
                icon={<IoCartOutline fontSize={"1.3rem"} />}
                btn_text={"Add to Cart"}
                variant="solidButton"
              />
            )}
          </VStack>
        </Flex>
      ))}
    </Box>
  );
};

import {
  Box,
  Button,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { HashLoader } from "react-spinners";

const contactErrObj = {
  email: { status: false, message: "" },
  select: { status: false, message: "Please select a category" },
  custom: {
    status: false,
    message: "Please give a title to your custom issue",
  },
  orderId: {
    status: false,
    message: "Please enter an Order Id or n/a if none",
  },
  desc: { status: false, message: "Please be as descriptive as possible." },
  root: { status: false, message: "" },
};

const ContactUs = () => {
  const context = useContext(AuthContext);

  const [custom, setCustom] = useState(false);
  const [customDesc, setCustomDesc] = useState("");
  const [category, setCategory] = useState(" ");
  const [firstR, setFirstR] = useState("yes");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState(contactErrObj);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");

  const selectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    if (e.target.value === "custom") {
      setCustom(true);
    } else {
      setCustom(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(contactErrObj);

    const errList = [];
    setIsLoading(true);

    if (!context.user.userId) {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setErr((prev) => ({
          ...prev,
          email: { status: true, message: "Please enter a valid email" },
        }));
        errList.push("email");
        // return;
      }
    }
    if (category === "custom") {
      if (customDesc.length < 5) {
        setErr((prev) => ({
          ...prev,
          custom: { ...prev.custom, status: true },
        }));
        errList.push("customDesc");
        // return;
      }
    } else if (category === " ") {
      setErr((prev) => ({ ...prev, select: { ...prev.select, status: true } }));
      errList.push("custom");
      // return;
    }
    if (orderId.length < 13 && orderId.toLowerCase() !== "n/a") {
      setErr((prev) => ({
        ...prev,
        orderId: { ...prev.orderId, status: true },
      }));
      errList.push("orderId");
      // return;
    }

    if (desc.length < 15) {
      setErr((prev) => ({ ...prev, desc: { ...prev.desc, status: true } }));
      errList.push("desc");
      // return;
    }

    if (errList.length > 0) {
      console.error("contains errors", errList);
      setIsLoading(false);
      return;
    }
    const formData = {
      userData: email || context.user.userId,
      category,
      customDesc,
      orderId,
      firstR,
      desc,
    };

    setTimeout(() => {
      setIsLoading(false);
      console.log(formData, "FORM");
    }, 5000);
  };

  return (
    <Container>
      <Heading
        as="h1"
        size={"2xl"}
        textAlign={"center"}
        mt={"2rem"}
        mb={"3rem"}
        fontWeight={500}
      >
        Contact Us
        <Text mt={3} fontSize={".8rem"}>
          helpme@comprise.com | +27 69 515 1499
        </Text>
      </Heading>
      {context.user.userId && (
        <Text fontSize={".9rem"}>Name: {context.user.name}</Text>
      )}
      {err.root.status && (
        <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
          {err.root.message}
        </Text>
      )}
      <form onSubmit={(e) => handleSubmit(e)}>
        <VStack align={"stretch"} mt={3} spacing={8}>
          <Box>
            {!context.user.userId && (
              <>
                <FormLabel fontSize={".9rem"}>
                  Email Address{" "}
                  <Text as={"span"} color={"rgb(199, 0, 0)"}>
                    *
                  </Text>
                </FormLabel>
                <Input
                  value={email}
                  type="email"
                  id="email"
                  placeholder="email@email.com"
                  _placeholder={{ fontSize: ".9rem" }}
                  focusBorderColor="black"
                  variant={"flushed"}
                  borderColor={"grey"}
                  borderBottomColor={err.email.status ? "rgb(199, 0, 0)" : ""}
                  _autofill={{
                    transition: "background-color 0s 600000s, color 0s 600000s",
                    boxShadow: "0 0 0px 1000px #EEEEEE inset",
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            )}
            {err.email.status && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {err.email.message}
              </Text>
            )}
          </Box>
          <Box>
            <FormLabel fontSize={".9rem"}>
              Issue Category{" "}
              <Text as={"span"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <Select
              //   value={"null"}
              fontSize={".9rem"}
              placeholder="Select Issue"
              outline={"none"}
              border={
                err.select.status
                  ? "1px solid rgb(199, 0, 0)"
                  : "1px solid black"
              }
              _focusVisible={{ borderColor: "black", boxShadow: "none" }}
              onChange={(e) => selectChange(e)}
            >
              <option value="damaged">Damaged Goods</option>
              <option value="delayed">Delayed or No Delivery</option>
              <option value="custom">Custom Issue</option>
            </Select>
            {err.select.status && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {err.select.message}
              </Text>
            )}
          </Box>
          {custom && (
            <Box>
              <FormLabel fontSize={".9rem"}>
                Custom Issue Title{" "}
                <Text as={"span"} color={"rgb(199, 0, 0)"}>
                  *
                </Text>
              </FormLabel>
              <Input
                value={customDesc}
                type="text"
                id="custom-input"
                focusBorderColor="black"
                variant={"flushed"}
                borderColor={"grey"}
                borderBottomColor={err.custom.status ? "rgb(199, 0, 0)" : ""}
                _autofill={{
                  transition: "background-color 0s 600000s, color 0s 600000s",
                  boxShadow: "0 0 0px 1000px #EEEEEE inset",
                }}
                placeholder="I Need Help"
                _placeholder={{ fontSize: ".9rem" }}
                onChange={(e) => setCustomDesc(e.target.value)}
              />
              {err.custom.status && (
                <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                  {err.custom.message}
                </Text>
              )}
            </Box>
          )}

          <Flex alignItems={"center"} justify={"space-between"}>
            <FormLabel fontSize={".9rem"}>
              <Flex>
                Order Id <Text color={"rgb(199, 0, 0)"}> *</Text>
              </Flex>
            </FormLabel>
            <Box w={"80%"}>
              <Input
                onChange={(e) => setOrderId(e.target.value)}
                value={orderId}
                type="text"
                id="orderNumber"
                focusBorderColor="black"
                variant={"flushed"}
                borderColor={"grey"}
                //   borderBottomColor={errors.password && "rgb(199, 0, 0)"}
                _autofill={{
                  transition: "background-color 0s 600000s, color 0s 600000s",
                  boxShadow: "0 0 0px 1000px #EEEEEE inset",
                }}
                placeholder="VGA-****8"
                _placeholder={{ fontSize: ".9rem" }}
              />
              <Text fontSize={".7rem"}>If no Order ID, input n/a</Text>
              {err.orderId.status && (
                <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                  {err.orderId.message}
                </Text>
              )}
            </Box>
          </Flex>
          <Flex>
            <FormLabel fontSize={".9rem"}>
              First Report?{" "}
              <Text as={"span"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <Box>
              <RadioGroup onChange={setFirstR} value={firstR}>
                <Stack direction={"row"}>
                  <Radio
                    value="yes"
                    borderColor={"black"}
                    defaultChecked
                    colorScheme="blackAlpha"
                  >
                    Yes
                  </Radio>
                  <Radio
                    value="no"
                    borderColor={"black"}
                    colorScheme="blackAlpha"
                  >
                    No
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </Flex>
          <Box>
            <FormLabel fontSize={".9rem"}>
              Describe Issue{" "}
              <Text as={"span"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Here is a sample placeholder"
              size="sm"
              focusBorderColor="black"
              borderColor={err.desc.status ? "rgb(199, 0, 0)" : "black"}
              h={150}
              borderRadius={".5rem"}
              resize={"none"}
            />
            {err.desc.status && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {err.desc.message}
              </Text>
            )}
          </Box>
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText={"Reporting..."}
            variant={"solidButton"}
            spinner={<HashLoader size={18} color="rgb(199, 0, 0)" />}
          >
            Send Report
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ContactUs;

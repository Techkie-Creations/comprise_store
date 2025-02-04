import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { FaRegFaceDizzy } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/", { replace: true }), 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex alignItems={"center"} mt={4} direction={"column"} gap={5}>
      <FaRegFaceDizzy size={250} />
      <Heading as="h1" size="2xl" textAlign={"center"}>
        <Text>404</Text>
        Oops! Page Not Found
      </Heading>
      <Text>
        Go to{" "}
        <NavLink to="/" replace>
          <Text as="span" textDecor={"underline"} color={"rgb(199, 0, 0)"}>
            Home
          </Text>
        </NavLink>{" "}
        Page
      </Text>
    </Flex>
  );
}

export default NotFound;

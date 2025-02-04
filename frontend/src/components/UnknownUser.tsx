import { Button, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";

const UnknownUser: FC<{ use: string }> = ({ use }) => {
  return (
    <Flex align={"center"} gap={"1.2rem"} flexDirection={"column"} mt={"4rem"}>
      <Text fontWeight={600}>Unknown Identity!</Text>
      <Text>
        Inorder For You to Use <b>{use}</b> You Need to Login!
      </Text>
      <Flex gap={".4rem"}>
        <NavLink to="/auth/login">
          <Button variant={"solidButton"} leftIcon={<LuLogIn />}>
            Login
          </Button>
        </NavLink>
        <NavLink to={"/auth/signup"}>
          <Button variant={"hollowButton"} leftIcon={<FaRegUser />}>
            Sign Up
          </Button>
        </NavLink>
      </Flex>
    </Flex>
  );
};

export default UnknownUser;

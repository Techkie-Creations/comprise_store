import {
  Box,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginFormSchema, LoginUserFormSchema } from "../utils/Types";
import { HashLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
// import { useUserAuth } from "../context/Test";

function Login() {
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginUserFormSchema),
  });

  const navigate = useNavigate();

  const context = useContext(AuthContext);

  const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
    const formData = { email: data.email, password: data.password };
    const results = await loginUser(formData);
    if (!results.success) {
      setError(results.level, { message: results.message });
      return;
    }
    context.setUserT({
      ...context.user,
      success: results.success,
      message: results.message,
      avatarUrl: results.avatarUrl,
      name: results.name,
      userId: results.userId,
    });
    navigate("/");
  };

  return (
    <Container py={"1rem"}>
      <Heading
        as="h1"
        size={"2xl"}
        textAlign={"center"}
        mt={"2rem"}
        mb={"3rem"}
        fontWeight={500}
      >
        Login
      </Heading>
      {errors.root && (
        <Text color={"rgb(199, 0, 0)"} my={"1rem"} textAlign={"center"}>
          {errors.root.message}
        </Text>
      )}
      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align={"stretch"} spacing={10}>
          <Box>
            <FormLabel>
              Email Address{" "}
              <Text as={"span"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="email@email.com"
              focusBorderColor="black"
              variant={"flushed"}
              borderColor={"grey"}
              borderBottomColor={errors.email && "rgb(199, 0, 0)"}
              _autofill={{
                transition: "background-color 0s 600000s, color 0s 600000s",
                boxShadow: "0 0 0px 1000px #EEEEEE inset",
              }}
            />
            {errors.email && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {errors.email.message}
              </Text>
            )}
          </Box>

          <Box>
            <FormLabel>
              Password{" "}
              <Text as={"span"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>

            <InputGroup size="md">
              <Input
                {...register("password")}
                type={show ? "text" : "password"}
                id="password"
                focusBorderColor="black"
                variant={"flushed"}
                borderColor={"grey"}
                borderBottomColor={errors.password && "rgb(199, 0, 0)"}
                _autofill={{
                  transition: "background-color 0s 600000s, color 0s 600000s",
                  boxShadow: "0 0 0px 1000px #EEEEEE inset",
                }}
                placeholder="*******"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  backgroundColor={"black"}
                  color={"#EEEEEE"}
                  border={"1px solid black"}
                  _hover={{ color: "black", backgroundColor: "#EEEEEE" }}
                  h={"1.75rem"}
                  borderBottomColor={errors.password && "rgb(199, 0, 0)"}
                  aria-label="show password"
                  icon={show ? <FaRegEyeSlash /> : <FaRegEye />}
                  onClick={() => setShow(!show)}
                />
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {errors.password.message}
              </Text>
            )}
            <Link to="/auth/forgotPassword">
              <Text mt={3} textDecoration={"underline"} fontSize={"small"}>
                Forgot Password?
              </Text>
            </Link>
          </Box>
          <Button
            // my={"2rem"}
            type="submit"
            isLoading={isSubmitting}
            loadingText={"Logging In..."}
            variant={"outline"}
            borderColor={"black"}
            color={"black"}
            fontWeight={500}
            spinner={<HashLoader size={18} color="rgb(199, 0, 0)" />}
            _hover={{ backgroundColor: "black", color: "white" }}
          >
            Login
          </Button>
        </VStack>
      </form>
      <Box textAlign={"center"} mt={"2rem"}>
        <Box w={"100%"} h={"1px"} backgroundColor={"black"} my={2} mb={4}></Box>
        Don't Have An Account?{" "}
        <Text fontWeight={700} as={"span"} textDecoration={"underline"}>
          <Link to={"/auth/signup"}>Sign Up</Link>
        </Text>
      </Box>
    </Container>
  );
}

export default Login;

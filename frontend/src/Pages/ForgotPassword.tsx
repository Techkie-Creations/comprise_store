import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import ReactCodeInput from "react-code-input";
import { SubmitHandler, useForm } from "react-hook-form";
import { ForgotPasswordSchema, ResetPassword } from "../utils/Types";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "../api/api";
import { useNavigate } from "react-router-dom";

const errorObj = {
  email: { error: false, message: "" },
  code: { error: false, message: "" },
  root: { error: false, message: "" },
};

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrors] = useState(errorObj);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [part, setPart] = useState("email");
  const [finalSuccess, setFinalSuccess] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPassword>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const formSubmit = async (e: FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    setIsLoading(true);

    if (type === "email") {
      const formData = { id: "email", data: email, email: "" };
      const results = await resetPassword(formData);
      console.log(results);
      if (!results.success) {
        if (results.level === "root") {
          setErrors((prev) => ({
            ...prev,
            root: { error: true, message: results.message },
          }));
          setIsLoading(false);
          return;
        }
        if (results.level === "email") {
          setErrors((prev) => ({
            ...prev,
            email: { error: true, message: results.message },
          }));
          setIsLoading(false);
          return;
        }
      }
      setErrors(errorObj);
      setPart("code");
    }
    if (type === "code") {
      const formData = { id: "code", data: code, email };
      const results = await resetPassword(formData);
      if (!results.success) {
        if (results.level === "root") {
          setErrors((prev) => ({
            ...prev,
            root: { error: true, message: results.message },
          }));
          setIsLoading(false);
          return;
        }
        if (results.level === "code") {
          setErrors((prev) => ({
            ...prev,
            code: { error: true, message: results.message },
          }));
          setIsLoading(false);
          return;
        }
      }
      setErrors(errorObj);
      setPart("password");
    }
    setIsLoading(false);
  };

  const onSubmit: SubmitHandler<ResetPassword> = async (data) => {
    const formData = { id: "password", data: data.password, email };
    const results = await resetPassword(formData);
    if (!results.success) {
      setError(results.level, results.message);
      return;
    }
    setTimeout(() => setFinalSuccess(true), 3000);
    setFinalSuccess(false);
    navigate("/auth/login");
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
        Forgot Password
      </Heading>
      {error.root && (
        <Text color={"rgb(199, 0, 0)"} my={"1rem"} textAlign={"center"}>
          {error.root.message}
        </Text>
      )}
      {errors.root && (
        <Text color={"rgb(199, 0, 0)"} my={"1rem"} textAlign={"center"}>
          {errors.root.message}
        </Text>
      )}
      {finalSuccess && (
        <Text color={"darkgreen"} my={"1rem"} textAlign={"center"}>
          Password Successfully Updated!
        </Text>
      )}
      <Box display={part === "email" ? "" : "none"}>
        <form onSubmit={(e) => formSubmit(e, "email")}>
          <FormLabel>
            Email Address{" "}
            <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
              *
            </Text>
          </FormLabel>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
            focusBorderColor="black"
            variant={"flushed"}
            borderColor={"grey"}
            borderBottomColor={error.email.error ? "rgb(199, 0, 0)" : ""}
            _autofill={{
              transition: "background-color 0s 600000s, color 0s 600000s",
              boxShadow: "0 0 0px 1000px #EEEEEE inset",
            }}
          />
          {error.email.error && (
            <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
              {error.email.message}
            </Text>
          )}
          <Button
            mt={7}
            type="submit"
            isLoading={isLoading}
            loadingText={"Sending..."}
            variant={"outline"}
            borderColor={"black"}
            color={"black"}
            fontWeight={500}
            spinner={<HashLoader size={18} color="rgb(199, 0, 0)" />}
            _hover={{ backgroundColor: "black", color: "white" }}
          >
            Send Reset Link
          </Button>
        </form>
      </Box>
      <Box display={part === "code" ? "" : "none"}>
        <form onSubmit={(e) => formSubmit(e, "code")}>
          <VStack spacing={2}>
            <FormLabel>
              Enter Code Here{" "}
              <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <ReactCodeInput
              type="text"
              fields={8}
              name="code"
              inputMode="full-width-latin"
              value={code}
              isValid={!error.code.error}
              onChange={(e) => setCode(e)}
            />
            {error.code.error && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {error.code.message}
              </Text>
            )}
            <Button
              mt={7}
              type="submit"
              isLoading={isLoading}
              loadingText={"Verifying Code..."}
              variant={"outline"}
              borderColor={"black"}
              color={"black"}
              fontWeight={500}
              spinner={<HashLoader size={18} color="rgb(199, 0, 0)" />}
              _hover={{ backgroundColor: "black", color: "white" }}
            >
              Verify Code
            </Button>
          </VStack>
        </form>
      </Box>
      <VStack align={"stretch"} display={part === "password" ? "" : "none"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <FormLabel>
              New Password{" "}
              <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <Input
              {...register("password")}
              type="password"
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
            {errors.password && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {errors.password.message}
              </Text>
            )}
          </Box>

          <Box>
            <FormLabel>
              Confirm Password{" "}
              <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <Input
              {...register("confirmPassword")}
              type="password"
              focusBorderColor="black"
              variant={"flushed"}
              borderColor={"grey"}
              borderBottomColor={errors.confirmPassword && "rgb(199, 0, 0)"}
              placeholder="*******"
              _autofill={{
                transition: "background-color 0s 600000s, color 0s 600000s",
                boxShadow: "0 0 0px 1000px #EEEEEE inset",
              }}
              id="CP_Password"
            />
            {errors.confirmPassword && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </Box>
          <Button
            mt={7}
            type="submit"
            isLoading={isSubmitting}
            loadingText={"Resetting..."}
            variant={"outline"}
            borderColor={"black"}
            color={"black"}
            fontWeight={500}
            spinner={<HashLoader size={18} color="rgb(199, 0, 0)" />}
            _hover={{ backgroundColor: "black", color: "white" }}
          >
            Reset Password
          </Button>
        </form>
      </VStack>
    </Container>
  );
};

export default ForgotPassword;

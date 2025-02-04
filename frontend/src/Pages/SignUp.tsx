import {
  Avatar,
  Container,
  Flex,
  FormLabel,
  Heading,
  Text,
  Input,
  Box,
  VStack,
  Button,
  IconButton,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { ChangeEvent, useContext, useState } from "react";
import { SignUpFormSchema, imageObject, UserFormSchema } from "../utils/Types";
import { IoMdClose } from "react-icons/io";
import { useForm, SubmitHandler } from "react-hook-form";
import { HashLoader } from "react-spinners";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../api/api";
import { fileObject } from "../utils/FileObject";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const SignUp = () => {
  const [file, setFile] = useState<string | null>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const context = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 0) {
      const image = e.target.files ? e.target.files[0] : new Blob();
      const imageUrl = URL.createObjectURL(image);
      setFile(imageUrl);

      const { name, type } =
        image instanceof File ? image : { name: "", type: "" };
      imageObject[0] = {
        fileUrl: imageUrl,
        fileName: name,
        fileType: type,
      };
    } else {
      const { fileUrl, fileName, fileType } = imageObject[0];
      const file = document.getElementById("file");
      if (fileUrl && fileName) {
        if (file instanceof HTMLInputElement) {
          file.files = await fileObject({ fileUrl, fileName, fileType }, false);
          console.log(
            "OBJ",
            fileObject({ fileUrl, fileName, fileType }, false)
          );
        }
      }
    }
  };

  const handleClick = async () => {
    const file = document.getElementById("file");
    if (file instanceof HTMLInputElement) {
      file.value = "";
      setFile("");
    }

    const { fileUrl, fileName, fileType } = imageObject[0];
    URL.revokeObjectURL(fileUrl);
    fileObject({ fileUrl, fileName, fileType }, true);
    imageObject.pop();
    resetField("avatar", { defaultValue: await fileObject(imageObject[0]) });
  };

  const onSubmit: SubmitHandler<SignUpFormSchema> = async (data) => {
    console.log(data);
    const formData = new FormData();

    const fileReturn = await fileObject(imageObject[0]);
    console.log("FILE RETURN", fileReturn[0]);
    formData.append(
      "avatar",
      data.avatar.length === 0 ? fileReturn[0] : data.avatar[0]
    );
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("defaultAvatar", file ? "false" : "true");
    console.log(formData);
    // try {
    //   const results = await registerUser(formData);
    //   // setShowToast(["success", results.message]);
    //   console.log(results);
    // } catch (error) {
    //   if (error instanceof Error) {
    //     // setShowToast(["error", error.message]);
    //     console.error("Error registering user:", error);
    //   }
    // }
    const results = await registerUser(formData);
    if (!results.success) {
      setError(
        results.level,
        { message: results.message },
        { shouldFocus: true }
      );
      return;
    }
    context.setUserT({
      ...context.user,
      success: results.success,
      message: results.message,
      avatarUrl: results.avatarUrl,
      name: results.name,
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
        mb={"4rem"}
        fontWeight={500}
      >
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align={"stretch"} spacing={5}>
          <Flex gap={"2rem"} w={"100%"}>
            <Box w={"100%"}>
              <FormLabel>
                First Name{" "}
                <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
                  *
                </Text>
              </FormLabel>
              <Input
                {...register("firstName")}
                id="fname"
                type="text"
                placeholder="John"
                focusBorderColor="black"
                variant={"flushed"}
                borderColor={"grey"}
                borderBottomColor={errors.firstName && "rgb(199, 0, 0)"}
                _autofill={{
                  transition: "background-color 0s 600000s, color 0s 600000s",
                  boxShadow: "0 0 0px 1000px #EEEEEE inset",
                }}
              />
              {errors.firstName && (
                <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                  {errors.firstName.message}
                </Text>
              )}
            </Box>

            <Box w={"100%"}>
              <FormLabel>
                Last Name{" "}
                <Text
                  colorScheme="red"
                  as={"span"}
                  fontWeight={"800"}
                  color={"rgb(199, 0, 0)"}
                >
                  *
                </Text>
              </FormLabel>
              <Input
                {...register("lastName")}
                type="text"
                placeholder="Doe"
                focusBorderColor="black"
                variant={"flushed"}
                id="lname"
                borderColor={"grey"}
                borderBottomColor={errors.lastName && "rgb(199, 0, 0)"}
                _autofill={{
                  transition: "background-color 0s 600000s, color 0s 600000s",
                  boxShadow: "0 0 0px 1000px #EEEEEE inset",
                }}
              />
              {errors.lastName && (
                <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                  {errors.lastName.message}
                </Text>
              )}
            </Box>
          </Flex>

          <Box>
            <FormLabel>
              Email Address{" "}
              <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
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
              <Text as={"span"} fontWeight={"800"} color={"rgb(199, 0, 0)"}>
                *
              </Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
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
                  borderBottomColor={errors.password && "rgb(199, 0, 0)"}
                  h={"1.75rem"}
                  aria-label="show password"
                  icon={showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
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
            <InputGroup size="md">
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                focusBorderColor="black"
                variant={"flushed"}
                borderColor={"grey"}
                borderBottomColor={errors.confirmPassword && "rgb(199, 0, 0)"}
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
                  borderBottomColor={errors.confirmPassword && "rgb(199, 0, 0)"}
                  h={"1.75rem"}
                  aria-label="show confirm Password"
                  icon={showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
            {errors.confirmPassword && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </Box>

          <Flex alignItems={"center"} gap={"1rem"} my={"1rem"}>
            {file ? (
              <Avatar
                name="User Avatar"
                src={file}
                size={"lg"}
                border={"1px solid black"}
              />
            ) : (
              <Avatar
                name="Default Avatar"
                src="https://img.freepik.com/premium-photo/man-with-beard-glasses-is-wearing-jacket-that-says-hes-wearing-jacket_113255-93084.jpg?size=626&ext=jpg&ga=GA1.2.2084454987.1726162968&semt=ais_hybrid"
                size="lg"
                border={"1px solid black"}
              />
            )}
            <Input
              {...register("avatar")}
              name="avatar"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e)}
              id="file"
            ></Input>

            {file && (
              <IconButton
                aria-label="cancel"
                size={"md"}
                icon={<IoMdClose size={20} />}
                border={"1px solid black"}
                backgroundColor={"transparent"}
                _hover={{
                  backgroundColor: "black",
                  color: "#EEEEEE",
                }}
                onClick={handleClick}
              />
            )}
            {errors.avatar && (
              <Text mt={2} fontSize={14} color={"rgb(199, 0, 0)"}>
                {errors.avatar.message}
              </Text>
            )}
          </Flex>
          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText={"Creating User..."}
            variant={"outline"}
            borderColor={"black"}
            color={"black"}
            fontWeight={500}
            spinner={<HashLoader size={18} color="rgb(199, 0, 0)" />}
            _hover={{ backgroundColor: "black", color: "white" }}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
      <Box textAlign={"center"} mt={"2rem"}>
        <Box w={"100%"} h={"1px"} backgroundColor={"black"} my={2} mb={4}></Box>
        Already have an account?{" "}
        <Text fontWeight={700} as={"span"} textDecoration={"underline"}>
          <Link to={"/auth/login"}>Login</Link>
        </Text>
      </Box>
    </Container>
  );
};

export default SignUp;

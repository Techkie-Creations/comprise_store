import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FC } from "react";
import { FaRegUser } from "react-icons/fa6";
import { LuLogIn } from "react-icons/lu";
import { NavLink } from "react-router-dom";

interface UserModal {
  text: string;
  icon: JSX.Element;
  btn_text: string | null;
  fontSize: string;
  variant: string;
}

const UserModal: FC<UserModal> = ({
  text,
  icon,
  btn_text,
  fontSize,
  variant,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        leftIcon={icon}
        variant={variant}
        onClick={onOpen}
        fontSize={fontSize}
      >
        {btn_text}
      </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={"#EEEEEE"}>
          <ModalHeader>User ID Unknown!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="1rem">
              Your User ID is needed before using the {text}!
            </Text>
          </ModalBody>

          <ModalFooter>
            <NavLink to="/auth/login">
              <Button
                variant={"solidButton"}
                leftIcon={<LuLogIn />}
                mr={3}
                onClick={onClose}
              >
                Login
              </Button>
            </NavLink>
            <NavLink to={"/auth/signup"}>
              <Button variant={"hollowButton"} leftIcon={<FaRegUser />}>
                Sign Up
              </Button>
            </NavLink>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserModal;

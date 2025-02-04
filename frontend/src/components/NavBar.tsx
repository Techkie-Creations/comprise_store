import {
  Avatar,
  Box,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { logoutUser, navBar } from "../api/api";
import { UserInfo } from "../utils/Types";
import {
  NavBarPopover,
  NavBarCategories,
  NavBarMenu,
} from "../utils/NavBarDeps";
import { IoExit } from "react-icons/io5";
import HashLoader from "react-spinners/HashLoader";

const NavBar = () => {
  const context = useContext(AuthContext);

  const userT = context.user;

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verified = async () => {
      const user: UserInfo = await navBar();
      console.log(user, "USER");
      context.setUserT(user);
      return;
    };
    verified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Logout = async () => {
    setIsLoading(true);
    const results = await logoutUser();
    if (!results.success) console.log("Failed to log out");
    context.setUserT({
      userId: false,
      success: false,
      message: "",
      avatarUrl: "",
      name: "",
    });
    setIsLoading(false);
    navigate("/");
  };

  return (
    <>
      <Box
        className="mainHeader"
        px="7"
        maxW="100%"
        borderBottom="1px solid black"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as={"h3"} fontFamily={`'Karma', serif`}>
            <NavLink to="/">Comprise Store</NavLink>
          </Heading>
          <Box>
            <Flex alignItems="center">
              <Tooltip label="Search">
                <Box
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "black",
                    color: "white",
                  }}
                  p={4}
                >
                  <span>
                    <IoIosSearch fontSize="30px" />
                  </span>
                </Box>
              </Tooltip>
              {NavBarMenu.map((menu, id) => (
                <Tooltip hasArrow label={menu.label} key={id}>
                  <NavLink to={menu.to}>
                    <Box
                      _hover={{
                        backgroundColor: "black",
                        color: "white",
                      }}
                      p={4}
                    >
                      <span>{menu.icon}</span>
                    </Box>
                  </NavLink>
                </Tooltip>
              ))}
              {userT.success ? (
                <Popover>
                  <Box
                    p={2}
                    _hover={{ backgroundColor: "black", cursor: "pointer" }}
                  >
                    <PopoverTrigger>
                      <Avatar
                        name={userT.name}
                        src={userT.avatarUrl}
                        border={"1px solid black"}
                      ></Avatar>
                    </PopoverTrigger>
                  </Box>
                  <PopoverContent
                    border={"2px solid black"}
                    w={"max-content"}
                    m={3}
                    zIndex={120}
                    position={"relative"}
                    _focusVisible={{ boxShadow: "none" }}
                    backgroundColor={"#EEEEEE"}
                  >
                    <PopoverArrow />
                    <PopoverHeader
                      textAlign={"center"}
                      color={"grey"}
                      fontSize={".8rem"}
                    >
                      {userT.name}
                    </PopoverHeader>
                    {NavBarPopover.map((item, key) => (
                      <Box key={key}>
                        <NavLink to={item.to}>
                          <Flex
                            align={"center"}
                            gap={3}
                            py={2}
                            px={4}
                            _hover={{
                              backgroundColor: "black",
                              color: "white",
                            }}
                          >
                            {item.icon}
                            {item.text}
                          </Flex>
                        </NavLink>
                      </Box>
                    ))}
                    <Box onClick={Logout}>
                      {!isLoading ? (
                        <Flex
                          align={"center"}
                          gap={3}
                          py={2}
                          px={4}
                          _hover={{
                            backgroundColor: "black",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          <IoExit size={"1.2rem"} />
                          Logout
                        </Flex>
                      ) : (
                        <Flex
                          align={"center"}
                          gap={3}
                          py={2}
                          px={4}
                          color={"gray"}
                        >
                          <HashLoader size={18} color="gray" />
                          Logging Out...
                        </Flex>
                      )}
                    </Box>
                  </PopoverContent>
                </Popover>
              ) : (
                <NavLink to="/auth/login">
                  <Tooltip label="Login">
                    <Box
                      _hover={{
                        cursor: "pointer",
                        backgroundColor: "black",
                        color: "white",
                      }}
                      p={4}
                    >
                      <CiUser fontSize="30px" strokeWidth={1} />
                    </Box>
                  </Tooltip>
                </NavLink>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box
        className="subHeader"
        background="black"
        color="#EEEEEE"
        position={"sticky"}
        top={0}
        zIndex={1}
      >
        <Flex alignItems={"center"} justifyContent={"space-evenly"}>
          {NavBarCategories.map((menu, key) => (
            <NavLink to={menu.to} key={key}>
              <Text
                as="p"
                _hover={{ backgroundColor: "#EEEEEE", color: "black" }}
                p={2.5}
              >
                {menu.text}
              </Text>
            </NavLink>
          ))}
        </Flex>
      </Box>
    </>
  );
};

export default NavBar;

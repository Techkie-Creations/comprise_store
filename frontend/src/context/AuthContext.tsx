import {
  createContext,
  Dispatch,
  //   PropsWithChildren,
  SetStateAction,
  //   useState,
} from "react";
import { UserInfo } from "../utils/Types";

const defaultValue: UserInfo = {
  userId: false,
  success: false,
  message: "",
  avatarUrl: "",
  name: "",
};

export const AuthContext = createContext<{
  user: UserInfo;
  setUserT: Dispatch<SetStateAction<UserInfo>>;
}>({
  user: defaultValue,
  setUserT: () => defaultValue,
});

import { BsPersonFillGear } from "react-icons/bs";
import { IoBagOutline, IoCallOutline, IoCartOutline } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";

export const NavBarPopover = [
  {
    text: "Account Settings",
    to: "/",
    icon: <BsPersonFillGear size={"1.2rem"} />,
  },
  {
    text: "Order History",
    to: "/",
    icon: <MdOutlineHistory size={"1.2rem"} />,
  },
];

export const NavBarMenu = [
  {
    label: "Contact Us",
    to: "/help/contactUs",
    icon: <IoCallOutline fontSize="30px" />,
  },
  {
    label: "Wish Bag",
    to: "/wishbag",
    icon: <IoBagOutline fontSize="30px" />,
  },
  {
    label: "Shopping Cart",
    to: "/",
    icon: <IoCartOutline fontSize="30px" />,
  },
];

export const NavBarCategories = [
  {
    text: "Beauty & Skincare",
    to: "/beauty&skincare",
  },
  {
    text: "Fashion",
    to: "/",
  },
  {
    text: "Electronics",
    to: "/",
  },
  {
    text: "Food & Delicacies",
    to: "/",
  },
  {
    text: "Entertainment",
    to: "/",
  },
  {
    text: "Explore More",
    to: "/",
  },
];

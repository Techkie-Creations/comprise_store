import { z } from "zod";

export const imageObject: ImageURL[] = [];

export const UserFormSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters!" })
      .refine(
        (val) =>
          /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+|^[\p{Letter}\s\-.']+$/gmu.test(val),
        { message: "Name is invalid!" }
      ),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters!" })
      .refine(
        (val) =>
          /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+|^[\p{Letter}\s\-.']+$/gmu.test(val),
        { message: "Name is invalid!" }
      ),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .refine(
        (val) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val),
        {
          message: "Your Password should contain number, letters and symbols!",
        }
      ),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    avatar: z.instanceof(FileList, { message: "Invalid file format!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

export type SignUpFormSchema = z.infer<typeof UserFormSchema>;

export const LoginUserFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .refine((val) => val.length > 0, { message: "Please enter your password" }),
});
export type LoginFormSchema = z.infer<typeof LoginUserFormSchema>;

export const ForgotPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .refine(
        (val) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(val),
        {
          message: "Your Password should contain number, letters and symbols!",
        }
      ),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });
export type ResetPassword = z.infer<typeof ForgotPasswordSchema>;

export const ContactFormSchema = z.object({
  email: z.string().email().nullable(),
  select: z
    .string({ message: "Please select a category" })
    .refine((val) => val.length > 3, { message: "Please select a category" }),
  custom: z.string().default(""),
  orderId: z
    .string()
    .refine((val) => val.length < 10 || val.toLowerCase() !== "n/a", {
      message: "Order Id must be provided or n/a if none",
    }),
  desc: z.string().refine((data) => data.length < 15, {
    message: "Please be as descriptive as possible",
  }),
});

export type ContactForm = z.infer<typeof ContactFormSchema>;

export type ImageURL = {
  fileUrl: string;
  fileName: string;
  fileType: string;
};

export type UserInfo = {
  userId: string | boolean;
  success: boolean;
  message: string;
  avatarUrl: string;
  name: string;
};

export type FilterObjects = {
  label: string;
  data: string[];
};

type ProductColors = {
  hex_value: string;
  colour_name: string;
};

export type BeautyType = {
  name: string;
  brand: string;
  price: number;
  description: string;
  image_link: string;
  rating: number | null;
  category: string;
  product_type: string;
  tag_list: string[];
  api_featured_image: string;
  product_colors: ProductColors[] | [];
};

export type SkincareType = {
  name: string;
  brand: string;
  image: string;
  type: string;
  ingredients: string[];
  safety: string;
  effects: string[];
  price: number;
  rating: number | null;
};

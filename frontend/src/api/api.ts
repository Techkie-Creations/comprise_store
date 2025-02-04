import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
// import data from "../assets/BeautyAssets/skincare.json";

const jar = new CookieJar();

export const api = wrapper(
  axios.create({ jar: jar, baseURL: "http://localhost:5000/api" })
);

export const navBar = async () => {
  const results = await api
    .post(
      "/test",
      { accessToken: `${document.cookie.split("=")[1]}` },
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
  return results;
};

export const registerUser = async (form: FormData) => {
  const results = await api
    .post("/auth/register", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      return response.data; // Handle successful upload response
    })
    .catch((err) => {
      return err.response.data; // Handle upload errors
    });
  return results;
};

export const loginUser = async (form: { email: string; password: string }) => {
  const results = await api
    .post("/auth/login", form, { withCredentials: true })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response.data;
    });
  console.log(results);
  return results;
};

export const resetPassword = async (form: object) => {
  const results = await api
    .post("/auth/resetPassword", form)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response.data;
    });
  return results;
};

export const logoutUser = async () => {
  const results = await api
    .post("/auth/logout", undefined, { withCredentials: true })
    .then((response) => response.data)
    .catch((error) => error);
  return results;
};

export const wishbag = async () => {
  const results = await api
    .get("/wishbag", { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => err);
  return results;
};

// export const beautyApi = async (endpoint: string) => {
//   const results = await api
//     .get(`/derma/${endpoint}`)
//     .then((response) => response.data)
//     .catch((err) => err.response.data);
//   return results;
// };

// const products = async () => {
//   // const results = await api
//   //   .post("/products", { data: nameChange })
//   //   .then((response) => response.data)
//   //   .catch((error) => error);
//   // console.log(results.data);
// };

// products();

import baseAxios from "axios";

const customAxios = baseAxios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default customAxios;

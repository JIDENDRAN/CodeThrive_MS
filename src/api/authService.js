import api from "./axios";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = (data) => {
  return api.post("/auth/register", data);
};

export const logout = () => {
  localStorage.removeItem("token");
};


const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
  },
  cars: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/cars/${id}`,
    create: "/products",
    update: (id) => `/cars/${id}`,
    delete: (id) => `/cars/${id}`,
  },
  showroom: {
    list: "/showrooms",
    details: (id) => `/showrooms/${id}`,
  },
};

export default endpoints;

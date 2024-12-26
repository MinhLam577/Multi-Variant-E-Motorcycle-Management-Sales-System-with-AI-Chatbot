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
    //setting
    categories: () => `/categories`,
    color: () => `/color`,
    branch: () => `/branch`,
  },
  showroom: {
    list: "/showrooms",
    details: (id) => `/showrooms/${id}`,
  },
};

export default endpoints;

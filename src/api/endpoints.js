const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    changePassword: "/auth/change-password",
  },
  user: {
    me: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    setRole: (id) => `/users/${id}`,
    changePassword: (id) => `/users/${id}`,
    uploadAvatar: "/users/upload",
  },
  motorbike: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/cars/${id}`,
  },
  cars: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/cars/${id}`,
    create: "/products",
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
    //setting
    categories: () => `/category-brand`,
    color: () => `/color`,
    brand: () => `/brand`,

    //upload image
    uploadImage: () => "/products/upload",
  },
  showroom: {
    list: "/showrooms",
    details: (id) => `/showrooms/${id}`,
  },

  //store
  store: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/cars/${id}`,
    create: "/products",
    update: (id) => `/cars/${id}`,
    delete: (id) => `/products/${id}`,
  },

  //category
  category: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/cars/${id}`,
    create: "/products",
    update: (id) => `/cars/${id}`,
    delete: (id) => `/products/${id}`,
  },

  //brand
  brand: {
    list: (page, size) => `/brand?current=${page}&pageSize=${size}`,
    details: (id) => `/brand/${id}`,
    update: (id) => `/brand/${id}`,
    delete: (id) => `/brand/${id}`,
    upload: "/upload",
  },
};

export default endpoints;

const endpoints = {
  auth: {
    login: "/auth/admin/login",
    logout: "/auth/admin/logout",
    refreshToken: "/auth/admin/refresh",
    forgotPassword: "/auth/admin/forgot-password",
    changePassword: "/auth/admin/change-password",
  },
  user: {
    details: (id) => `/users/${id}`,
    update: (id) => `/users/${id}`,
    setRole: (id) => `/users/${id}`,
    changePassword: (id) => `/users/${id}`,
    uploadAvatar: () => "/users/upload",
    list: (page, limit) => `/users?current=${page}&pageSize=${limit}`,
  },

  customers: {
    details: (id) => `/customers/${id}`,
    update: (id) => `/customers/${id}`,
    setRole: (id) => `/customers/${id}`,
    changePassword: (id) => `/customers/${id}`,
    uploadAvatar: "/customers/upload",
    list: (page, limit) => `customers/?page=${page}&limit=${limit}`,
  },
  motorbike: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/products/${id}`,
    //setting

    // get
    categories: "/categories",
    color: "/color",
    brand: "/brand",
  },
  cars: {
    list: (page, size) => `/products?current=${page}&pageSize=${size}`,
    details: (id) => `/cars/${id}`,
    create: "/products",
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,

    //setting
    categories: () => `/category`,
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
    list: `/categories`,
    details: (id) => `/categories/${id}`,
    create: "/categories",
    update: (id) => `/categories/${id}`,
    delete: (id) => `/categories/${id}`,
  },

  //brand
  brand: {
    list: (page, size) => `/brand?current=${page}&pageSize=${size}`,
    details: (id) => `/brand/${id}`,
    update: (id) => `/brand/${id}`,
    delete: (id) => `/brand/${id}`,
    upload: "/upload",
  },

  // branch
  branch: {
    list: (page, size) => `/branch?pageSize=${page}&current=${size}`,
    details: (id) => `/branch/${id}`,
    update: (id) => `/branch/${id}`,
    delete: (id) => `/branch/${id}`,
    upload: "/upload",
  },

  // voucher
  vouchers: {
    list: (page, size) => `/vouchers?current=${page}&pageSize=${size}`,
    details: (id) => `/vouchers/${id}`,
    update: (id) => `/vouchers/${id}`,
    delete: (id) => `/vouchers/${id}`,
    create: () => `/vouchers`,
    upload: "/upload",
  },
  // role
  role: {
    list: (page, size) => `/vouchers?current=${page}&pageSize=${size}`,
    details: (id) => `/vouchers/${id}`,
    update: (id) => `/vouchers/${id}`,
    delete: (id) => `/vouchers/${id}`,
    create: () => `/vouchers`,
    upload: "/upload",
  },

  //permission
  permission: {
    list: (page, size) => `/permission?current=${page}&pageSize=${size}`,
    details: (id) => `/permission/${id}`,
    update: (id) => `/permission/${id}`,
    delete: (id) => `/permission/${id}`,
    create: () => `/permission`,
    upload: "/upload",
  },
  // review
  review: {
    list: (page, size) => `/review?current=${page}&pageSize=${size}`,
    details: (id) => `/review/${id}`,
    update: (id) => `/review/${id}`,
    delete: (id) => `/review/hard-delete/${id}`,
    create: () => `/review`,
    upload: "/review/upload-images",
  },

  // review
  warehouse: {
    list: () => `/warehouse`,
    details: (id) => `/warehouse/${id}`,
    update: (id) => `/warehouse/${id}`,
    delete: (id) => `/warehouse/${id}`,
    create: () => `/warehouse`,
  },

  // blogs - categories
  blogcategories: {
    list: () => `/blog-categories`,
    details: (id) => `/blog-categories/${id}`,
    update: (id) => `/blog-categories/${id}`,
    delete: (id) => `/blog-categories/${id}`,
    create: () => `/blog-categories`,
  },
  // blog - categories
  blogs: {
    list: () => `/blogs`,
    details: (id) => `/blogs/${id}`,
    update: (id) => `/blogs/${id}`,
    delete: (id) => `/blogs/${id}`,
    create: () => `/blogs`,
    upload: "/blogs/upload-image",
    uploads: "/blogs/upload-images",
  },
  // received - address
  receive_address: {
    list: () => `/receive-address`,
    details: (id) => `/receive-address/${id}`,
    update: (id) => `/receive-address/${id}`,
    delete: (id) => `/receive-address/${id}`,
    create: () => `/receive-address`,
    upload: "/receive-address/upload-image",
    uploads: "/receive-address/upload-images",
  },
};

export default endpoints;

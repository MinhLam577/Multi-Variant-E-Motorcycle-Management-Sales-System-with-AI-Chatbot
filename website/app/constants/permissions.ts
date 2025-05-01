export const ALL_PERMISSIONS = {
  VOURCHERS: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/vouchers",
      module: "VOUCHERS",
    },
    CREATE: {
      method: "POST",
      path: "/api/v1/vouchers",
      module: "VOUCHERS",
    },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/vouchers/:id",
      module: "VOUCHERS",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/vouchers/:id",
      module: "VOUCHERS",
    },
  },
  WAREHOUSE: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/warehouse",
      module: "WAREHOUSE",
    },
    CREATE: { method: "POST", path: "/api/v1/warehouse", module: "WAREHOUSE" },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/warehouse/:id",
      module: "WAREHOUSE",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/warehouse/:id",
      module: "WAREHOUSE",
    },
  },
  PERMISSIONS: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/permissions",
      module: "PERMISSIONS",
    },
    CREATE: {
      method: "POST",
      path: "/api/v1/permissions",
      module: "PERMISSIONS",
    },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/permissions/:id",
      module: "PERMISSIONS",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/permissions/:id",
      module: "PERMISSIONS",
    },
  },
  BRANCH: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/branch",
      module: "BRANCH",
    },
    CREATE: { method: "POST", path: "/api/v1/branch", module: "BRANCH" },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/branch/:id",
      module: "BRANCH",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/branch/:id",
      module: "BRANCH",
    },
  },
  ROLES: {
    GET_PAGINATE: { method: "GET", path: "/api/v1/roles", module: "ROLES" },
    CREATE: { method: "POST", path: "/api/v1/roles", module: "ROLES" },
    UPDATE: { method: "PATCH", path: "/api/v1/roles/:id", module: "ROLES" },
    DELETE: { method: "DELETE", path: "/api/v1/roles/:id", module: "ROLES" },
  },
  USERS: {
    GET_PAGINATE: { method: "GET", path: "/api/v1/users", module: "USERS" },
    CREATE: { method: "POST", path: "/api/v1/users", module: "USERS" },
    UPDATE: { method: "PATCH", path: "/api/v1/users/:id", module: "USERS" },
    DELETE: { method: "DELETE", path: "/api/v1/users/:id", module: "USERS" },
  },

  EXPORT: {
    GET_PAGINATE: { method: "GET", path: "/api/v1/export", module: "EXPORT" },
    CREATE: { method: "POST", path: "/api/v1/export", module: "EXPORT" },
    UPDATE: { method: "PATCH", path: "/api/v1/export/:id", module: "EXPORT" },
    DELETE: { method: "DELETE", path: "/api/v1/export/:id", module: "EXPORT" },
  },

  BLOGS: {
    GET_PAGINATE: { method: "GET", path: "/api/v1/blogs", module: "BLOGS" },
    CREATE: { method: "POST", path: "/api/v1/blogs", module: "BLOGS" },
    UPDATE: { method: "PATCH", path: "/api/v1/blogs/:id", module: "BLOGS" },
    DELETE: { method: "DELETE", path: "/api/v1/blogs/:id", module: "BLOGS" },
  },

  BLOGCATEGORY: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/blog-categories",
      module: "BLOGCATEGORY",
    },
    CREATE: { method: "POST", path: "/api/v1/blogs", module: "BLOGCATEGORY" },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/blog-categories/:id",
      module: "BLOGCATEGORY",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/blog-categories/:id",
      module: "BLOGCATEGORY",
    },
  },

  CUSTOMERS: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/customers",
      module: "CUSTOMERS",
    },
    CREATE: {
      method: "POST",
      path: "/api/v1/customers",
      module: "CUSTOMERS",
    },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/blog-customers/:id",
      module: "CUSTOMERS",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/blog-customers/:id",
      module: "CUSTOMERS",
    },
  },
  CATEGORIES: {
    GET_PAGINATE: {
      method: "GET",
      path: "/api/v1/categories",
      module: "CATEGORIES",
    },
    CREATE: {
      method: "POST",
      path: "/api/v1/categories",
      module: "CATEGORIES",
    },
    UPDATE: {
      method: "PATCH",
      path: "/api/v1/categories/:id",
      module: "CATEGORIES",
    },
    DELETE: {
      method: "DELETE",
      path: "/api/v1/categories/:id",
      module: "CATEGORIES",
    },
  },
};

export const ALL_MODULES = {
  AUTH: "AUTH",
  WAREHOUSE: "WAREHOUSE",
  FILES: "FILES",
  VOURCHERS: "VOURCHERS",
  PERMISSIONS: "PERMISSIONS",
  BRANCH: "BRANCH",
  ROLES: "ROLES",
  USERS: "USERS",
  BLOGS: "BLOGS",
  CATEGORIES: "CATEGORIES",
  BLOGCATEGORY: "BLOGCATEGORY",
  EXPORT: "EXPORT",
};

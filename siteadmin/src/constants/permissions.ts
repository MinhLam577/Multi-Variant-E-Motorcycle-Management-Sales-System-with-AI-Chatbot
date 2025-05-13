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
        CREATE_FOR_CUSTOMER: {
            method: "POST",
            path: "/api/v1/vouchers/give_customer/:id",
            module: "VOUCHERS",
        },
    },
    // tặng voucher cho khách
    WAREHOUSE: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/warehouse",
            module: "WAREHOUSE",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/warehouse",
            module: "WAREHOUSE",
        },
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
        DELETE: {
            method: "DELETE",
            path: "/api/v1/roles/:id",
            module: "ROLES",
        },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", path: "/api/v1/users", module: "USERS" },
        CREATE: { method: "POST", path: "/api/v1/users", module: "USERS" },
        UPDATE: { method: "PATCH", path: "/api/v1/users/:id", module: "USERS" },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/users/:id",
            module: "USERS",
        },
    },
    EXPORT: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/export",
            module: "EXPORT",
        },
        CREATE: { method: "POST", path: "/api/v1/export", module: "EXPORT" },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/export/:id",
            module: "EXPORT",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/export/:id",
            module: "EXPORT",
        },
    },
    IMPORT: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/import",
            module: "IMPORT",
        },
        CREATE: { method: "POST", path: "/api/v1/import", module: "IMPORT" },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/import/:id",
            module: "IMPORT",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/import/:id",
            module: "IMPORT",
        },
    },
    DETAIL_IMPORT: {
        CREATE: {
            method: "POST",
            path: "/api/v1/detail-import",
            module: "DETAIL_IMPORT",
            description:
                "Chi tiết nhập kho biến thể tồn tại đã oki, data lấy từ file txt trong nhóm tele",
        },
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/detail-import",
            module: "DETAIL_IMPORT",
            description: "Hiển thị danh sách nhập kho",
        },
        GET_BY_ID: {
            method: "GET",
            path: "/api/v1/detail-import/:id",
            module: "DETAIL_IMPORT",
        },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/detail-import/:id",
            module: "DETAIL_IMPORT",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/detail-import/:id",
            module: "DETAIL_IMPORT",
        },
    },
    BLOGS: {
        GET_PAGINATE: { method: "GET", path: "/api/v1/blogs", module: "BLOGS" },
        CREATE: { method: "POST", path: "/api/v1/blogs", module: "BLOGS" },
        UPDATE: { method: "PATCH", path: "/api/v1/blogs/:id", module: "BLOGS" },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/blogs/:id",
            module: "BLOGS",
        },
    },

    BLOGCATEGORY: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/blog-categories",
            module: "BLOGCATEGORY",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/blog-categories",
            module: "BLOGCATEGORY",
        },
        // cập nhật toàn bộ trường
        UPDATE: {
            method: "PUT",
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
    ORDERS: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/order",
            module: "ORDERS",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/order",
            module: "ORDERS",
        },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/order/:id",
            module: "ORDERS",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/order/:id",
            module: "ORDERS",
        },
    },
};

export const ALL_MODULES = {
    AUTH: "AUTH",
    WAREHOUSE: "WAREHOUSE",
    FILES: "FILES",
    VOUCHERS: "VOURCHERS",
    PERMISSIONS: "PERMISSIONS",
    BRANCH: "BRANCH",
    ROLES: "ROLES",
    USERS: "USERS",
    CUSTOMERS: "CUSTOMERS",
    BLOGS: "BLOGS",
    CATEGORIES: "CATEGORIES",
    BLOGCATEGORY: "BLOGCATEGORY",
    EXPORT: "EXPORT",
    DETAIL_IMPORT: "DETAIL_IMPORT",
    ORDERS: "ORDERS",
};

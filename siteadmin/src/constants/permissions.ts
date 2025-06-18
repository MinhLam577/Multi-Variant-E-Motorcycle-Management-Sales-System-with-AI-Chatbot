export const ALL_PERMISSIONS = {
    USER: {
        GET_PAGINATE: { method: "GET", path: "/api/v1/users", module: "USER" },
        CREATE: { method: "POST", path: "/api/v1/users", module: "USER" },
        UPDATE: { method: "PATCH", path: "/api/v1/users/:id", module: "USER" },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/users/:id",
            module: "USER",
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
    PRODUCTS: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/products",
            module: "PRODUCTS",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/products",
            module: "PRODUCTS",
        },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/products/:id",
            module: "PRODUCTS",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/products/:id",
            module: "PRODUCTS",
        },
    },
    SKUS: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/skus",
            module: "SKUS",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/skus",
            module: "SKUS",
        },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/skus/:id",
            module: "SKUS",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/skus/:id",
            module: "SKUS",
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
        CANCEL: {
            method: "PATCH",
            path: "/api/v1/order/:id/cancel",
            module: "ORDERS",
        },

        PRINT_ORDER: {
            method: "GET",
            path: "/api/v1/order/print/:id",
            module: "ORDERS",
        },
        CONFIRM: {
            method: "PATCH",
            path: "/api/v1/order/:id/confirm",
            module: "ORDERS",
        },
        EXPORTED: {
            method: "PATCH",
            path: "/api/v1/order/:id/export",
            module: "ORDERS",
        },
        HAND_OVER: {
            method: "PATCH",
            path: "/api/v1/order/:id/hand-over",
            module: "ORDERS",
        },
        DELIVERING: {
            method: "PATCH",
            path: "/api/v1/order/:id/deliver",
            module: "ORDERS",
        },
        SHIPPING: {
            method: "PATCH",
            path: "/api/v1/order/:id/ship",
            module: "ORDERS",
        },
        DELIVERED: {
            method: "PATCH",
            path: "/api/v1/order/:id/ship-success",
            module: "ORDERS",
        },
        FAIL_DELIVERY: {
            method: "PATCH",
            path: "/api/v1/order/:id/failed-delivery",
            module: "ORDERS",
        },
    },
    VOURCHERS: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/vouchers",
            module: "VOURCHERS",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/vouchers",
            module: "VOURCHERS",
        },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/vouchers/:id",
            module: "VOURCHERS",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/vouchers/:id",
            module: "VOURCHERS",
        },
        CREATE_FOR_CUSTOMER: {
            method: "POST",
            path: "/api/v1/vouchers/give_customer/:id",
            module: "VOURCHERS",
        },
    },
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
    BRANDS: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/brand",
            module: "BRANDS",
        },
        CREATE: {
            method: "POST",
            path: "/api/v1/brand",
            module: "BRANDS",
        },
        UPDATE: {
            method: "PATCH",
            path: "/api/v1/brand/:id",
            module: "BRANDS",
        },
        DELETE: {
            method: "DELETE",
            path: "/api/v1/brand/:id",
            module: "BRANDS",
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
    DASHBOARD: {
        GET_PAGINATE: {
            method: "GET",
            path: "/api/v1/dashboard",
            module: "DASHBOARD",
        },
    },
};

export const ALL_MODULES = {
    DASHBOARD: "DASHBOARD",
    AUTH: "AUTH",
    USER: "USER",
    CUSTOMERS: "CUSTOMERS",
    PRODUCTS: "PRODUCTS",
    SKUS: "SKUS",
    CATEGORIES: "CATEGORIES",
    BLOGCATEGORY: "BLOGCATEGORY",
    BLOGS: "BLOGS",
    ORDERS: "ORDERS",
    VOURCHERS: "VOURCHERS",
    WAREHOUSE: "WAREHOUSE",
    BRANDS: "BRANDS",
    PERMISSIONS: "PERMISSIONS",
    ROLES: "ROLES",
    EXPORT: "EXPORT",
    IMPORT: "IMPORT",
    DETAIL_IMPORT: "DETAIL_IMPORT",
    FILES: "FILES",
};

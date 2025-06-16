const endpoints = {
    base: {
        uploadImagesToServer: "/products/upload/multipleImage",
        convertUrlToBase64: (url: string) =>
            `/brand/convert-url-to-base64?url=${url}`,
    },
    import: {
        list: (query: string) => `/import?${query}`,
        create: () => `/detail-import`,
        update: (id: string) => `/detail-import/${id}`,
        detail: (id: string) => `/import/${id}`,
        delete: (id: string) => `/import/${id}`,
    },
    export: {
        list: (query: string) => `/export?${query}`,
        create: () => `/export/Orders`,
        update: (id: string) => `/export/${id}`,
        detail: (id: string) => `/export/${id}`,
        delete: (id: string) => `/export/${id}`,
    },
    product: {
        getListProduct: (query: string) => "/products?" + query,
        detail: (id: string) => `/products/${id}`,
        create: "/products",
        update: (id: string) => `/products/${id}`,
        uploadImagesToServer: "/products/upload/multipleImage",
        softDelete: (id: string) => `/products/${id}/soft`,
        restoreDelete: (id: string) => `/products/${id}/restore`,
    },
    options: {
        list: () => "/option",
    },
    authAdmin: {
        login: "/auth/admin/login",
        logout: "/auth/admin/logout",
        refreshToken: "/auth/refresh",
        forgotPassword: "/auth/forgot-password",
        changePassword: "/auth/change-password",
        getAccount: "/auth/admin/getAccount",
    },
    user: {
        details: (id: string) => `/users/${id}`,
        update: (id: string) => `/users/${id}`,
        remove: (id: string) => `/users/${id}`,
        setRole: (id: string) => `/users/${id}`,
        changePassword: (id: string) => `/users/${id}`,
        uploadAvatar: () => "/users/upload",
        list: (query: string) => `/users?${query}`,
        callBulkCreateUser: "/users/callBulkCreateUser",
        // tạo customer
        create: "/users",
    },

    customers: {
        details: (id) => `/customers/${id}`,
        update: (id) => `/customers/${id}`,
        setRole: (id) => `/customers/${id}`,
        changePassword: (id) => `/customers/${id}`,
        uploadAvatar: "/customers/upload",
        list: (query: string) => `/customers?${query}`,
        // tạo thông qua import file
        callBulkCreateCustomer: "/users/callBulkCreateCustomer",
        create: "/customers",
        delete: (id) => `/customers/${id}`,
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

    categories: {
        list: (query: string) => `/categories?${query}`,
        create: () => `/categories`,
        update: (id: string) => `/categories/${id}`,
        detail: (id: string) => `/categories/${id}`,
        remove: (id: string) => `/categories/${id}`,
    },

    //brand
    brand: {
        list: (query: string) => `/brand?${query}`,
        create: () => `/brand`,
        update: (id: string) => `/brand/${id}`,
        delete: (id: string) => `/brand/${id}`,
    },

    // branch
    branch: {
        list: (page, size) => `/branch?pageSize=${page}&current=${size}`,
        details: (id) => `/branch/${id}`,
        update: (id) => `/branch/${id}`,
        delete: (id) => `/branch/${id}`,
        upload: "/branch/upload",
        create: "/branch",
    },

    // voucher
    vouchers: {
        list: () => `/vourchers`,
        details: (id) => `/vourchers/${id}`,
        update: (id) => `/vourchers/${id}`,
        delete: (id) => `/vourchers/${id}`,
        create: `/vourchers`,
        upload: "/upload",
        getList_Customer_no_voucher: (id) =>
            `/vourchers/customer_no_voucher/${id}`,
        give_customer_voucher: (id) => `/vourchers/give_customer/${id}`,
    },
    // type-coucher
    type_voucher: {
        list: `/type-voucher`,
        details: (id) => `/type-voucher/${id}`,
        update: (id) => `/type-voucher/${id}`,
        delete: (id) => `/type-voucher/${id}`,
        create: () => `/type-voucher`,
    },
    // role
    role: {
        list: () => `/role`,
        details: (id) => `/role/${id}`,
        update: (id) => `/role/update_role_permission/${id}`,
        delete: (id) => `/role/${id}`,
        create: () => `/role`,
        upload: "/upload",
        // delete permission dựa vào role
        delete_Role_Permission: (id) => `/delete_role_permision/${id}`,
    },

    //permission
    permission: {
        list: (query: string) => `/permission?${query}`,
        details: (id) => `/permission/${id}`,
        update: (id) => `/permission/${id}`,
        delete: (id) => `/permission/${id}`,

        create: `/permission`,
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
        list: (query: string) => `/blog-categories?${query}`,
        details: (id) => `/blog-categories/${id}`,
        update: (id) => `/blog-categories/${id}`,
        delete: (id) => `/blog-categories/${id}`,
        create: () => `/blog-categories`,
    },
    // blog - categories
    blogs: {
        list: (query: string) => `/blogs?${query}`,
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
    order: {
        list: (query: string = "current=1&pageSize=20") => `/order?${query}`,
        getStatus: () => "/order/order-status",
        getOrderDetail: (id: string) => `/order/${id}`,
        updateOrderStatus: (id: string) => `/order/${id}/status`,
        confirmOrder: () => `/order/confirm`,
        cancelOrder: (id: string) => `/order/${id}/cancel`,
        failedDelivery: (id: string) => `/order/${id}/failed-delivery`,
        returnOrder: (id: string) => `/order/${id}/return-order`,
        revenueProfitStatistic: () => "/order/revenue-profit-statics",
        totalRevenueByYear: () => `/order/total-revenue-profit-statics`,
        orderStatusStatics: () => `/order/order-status-statics`,
    },
    paymentMethod: {
        list: () => `/payment-method`,
        getPaymentName: () => `/payment-method/payment-method-name`,
        getPaymentStatus: () => "/order/payment-status",
    },

    skus: {
        list: (query: string) => `/skus?${query}`,
        create: () => "/skus",
        update: (id: string) => `/skus/${id}`,
        remove: (id: string) => `/skus/${id}`,
        getDetailImportsById: (id: string) => `/skus/${id}/detail-import`,
        getDetailImportsByIds: () => `/skus/detail-imports-by-ids`,
    },
    // province
    province: {
        list: `/province`,
    },

    // district
    district: {
        districtByName: (provinceId) => `/district?provinceId=${provinceId}`,
    },
    // ward
    ward: {
        wardByName: (districtId) => `/ward?districtId=${districtId}`,
    },
    // cart
    cart: {
        list: () => `/cart`,
        details: (id) => `/cart/${id}`,
        update: (id) => `/cart/${id}`,
        delete: (id) => `/cart/${id}`,
        create: () => `/cart`,
        upload: "/cart/upload-image",
        uploads: "/cart/upload-images",
    },

    permissionModule: {
        list: () => `/Permissions_Modules`,
    },
};

export default endpoints;

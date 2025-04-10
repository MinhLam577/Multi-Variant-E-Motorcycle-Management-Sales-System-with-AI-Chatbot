const endpoints = {
    product: {
        getListProduct: (query: string) => "/products?" + query,
    },
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
        list: (page, limit) => `customers/?page=${page}&limit=${limit}`,
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
        list: `/categories`,
    },

    //brand
    brand: {
        list: (query: string) => `/brand?${query}`,
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
    order: {
        list: (query: string = "current=1&pageSize=20") => `/order?${query}`,
        getStatus: () => "/order/order-status",
        getOrderDetail: (id: string) => `/order/${id}`,
        updateOrderStatus: (id: string) => `/order/${id}/status`,
        confirmOrder: () => `/order/confirm`,
        cancelOrder: (id: string) => `/order/${id}/cancel`,
        failedDelivery: (id: string) => `/order/${id}/failed-delivery`,
        returnOrder: (id: string) => `/order/${id}/return-order`,
    },
    paymentMethod: {
        list: () => `/payment-method`,
        getPaymentName: () => `/payment-method/payment-method-name`,
        getPaymentStatus: () => "/order/payment-status",
    },

    sku: {
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
    // Blogs
};

export default endpoints;

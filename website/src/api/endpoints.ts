const endpoints = {
    product: {
        getListProduct: (query: string) => "/products?" + query,
        getDetailProduct: (id: string) => `/products/${id}`,
        getDetailSKU: (id: string) => `/products/getSku/${id}`,
        getDetailProduct_user_page_id: (id: string) =>
            `/products/user-page-id/${id}`,
        getBestSellingProducts: (query: string) =>
            `/products/best-selling?${query}`,
        getProductsSortBy: () => `/products/sort-by`,
    },
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        logout: "/auth/logout",
        refreshToken: "/auth/refresh",
        forgotPassword: "/auth/forgot-password",
        check_code: "/auth/check-code",
        changePassword: "/auth/change-password",
        retry_active: "/auth/retry-active",
        retry_password: "auth/retryPassword",
        change_password: "auth/change-password",
        contactPrice: "auth/contact",
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
    loginGoogle: "/customers/profile",
    changePassword_inProfile: "/customers/changePassword",
  },
    cars: {
        list: (page, size) => `/products?current=${page}&pageSize=${size}`,
        details: (id) => `/cars/${id}`,
        create: "/products",
        update: (id) => `/products/${id}`,
        delete: (id) => `/products/${id}`,

        //category
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
        list: (query: string) => `/categories?${query}`,
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
        create: "/branch",
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
        getListVoucher_Of_Customer: () => `user-vourcher/user_voucher`,
        getVoucher_Of_Customer_ByID: (id) => `user-vourcher/${id}`,
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
        list: (page, size) => `/permission?current=${page}&pageSize=${size}`,
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
    blogCategories: {
        list: (query: string) => `/blog-categories?${query}`,
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
        listAddressCustomer: (customerId) =>
            `/receive-address/customer/${customerId}`,
        details: (id) => `/receive-address/${id}`,
        setAddressDefault: (idAddress) =>
            `/receive-address/${idAddress}/default`,
        getAddressDefault: (id) => `/receive-address/customer/${id}/default`,
        update: (id) => `/receive-address/${id}`,
        delete: (id) => `/receive-address/${id}`,
        create: () => `/receive-address`,
        upload: "/receive-address/upload-image",
        uploads: "/receive-address/upload-images",
    },
    order: {
        // list: (customerId: string, query: string = "current=1&pageSize=20") =>
        // `/order/${customerId}/customer?${query}`,
           list: ( query: string = "current=1&pageSize=20") =>
        `/order/?${query}`,
        getStatus: () => "/order/order-status",
        getOrderDetail: (id: string) => `/order/${id}`,
        updateOrderStatus: (id: string) => `/order/${id}/status`,
        confirmOrder: () => `/order/confirm`,
        cancelOrder: (id: string) => `/order/${id}/cancel`,
        failedDelivery: (id: string) => `/order/${id}/failed-delivery`,
        returnOrder: (id: string) => `/order/${id}/return-order`,
        createOrder: () => "/order/create-from-cartItem",
    },

    // zaloPay
    zalo_pay: {
        createZalopayOrder: () => "/zalo-payment/create-order",
    },
    // // Payos
    pay_os: {
        createPayosOrder: () => "/payos/create-order",
        cancel_order_payos :(orderCode)=>`/payos/cancel-order/${orderCode}`
    },
    paymentMethod: {
        list: () => `/payment-method`,
        getPaymentName: () => `/payment-method/payment-method-name`,
        getPaymentStatus: () => "/order/payment-status",
    },
  
    sku: {
        getDetailImportsById: (id: string) => `/skus/${id}/detail-import`,
        getDetailImportsByIds: () => `/skus/detail-imports-by-ids`,
        GetSkusByOptionValueIdsAlreadyLogin: () =>
            `/skus/GetSkusByOptionValueIdsAlreadyLogin`,
        GetSkusByOptionValueIdsNoneLogin: () =>
            `/skus/GetSkusByOptionValueIdsNoneLogin`,
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
        // cập nhật theo số lượng
        update: (id) => `/cart/${id}`,
        // xóa từng biến thể trong giỏ hàng
        deleteSkus: (id) => `/cart/${id}`,
        // xóa từng cartItem trong giỏ hàng
        deleteCartItem: (id) => `/cart/cartItem/${id}`,
        // xóa  giỏ hàng
        deleteCart: () => `/cart`,

        create: () => `/cart`,
        upload: "/cart/upload-image",
        uploads: "/cart/upload-images",
    },
    delivery: {
        // Tạo phương thức giao hàng mới
        create: () => `/delivery-method`,

        // Lấy danh sách tất cả phương thức giao hàng
        list: () => `/delivery-method`,

        // Lấy chi tiết phương thức giao hàng theo ID
        details: (id: string | number) => `/delivery-method/${id}`,

        // Cập nhật phương thức giao hàng theo ID
        update: (id: string | number) => `/delivery-method/${id}`,

        // Xóa phương thức giao hàng theo ID
        delete: (id: string | number) => `/delivery-method/${id}`,
    },

    paymentMethodOption: {
        // Tạo phương thức thanh toán mới
        create: () => `/payment-method-option`,

        // Lấy danh sách tất cả phương thức thanh toán
        list: () => `/payment-method-option`,

        // Lấy chi tiết phương thức thanh toán theo ID
        details: (id: string | number) => `/payment-method-option/${id}`,

        // Lấy phương thức thanh toán theo tên
        getByName: (name: string) => `/payment-method-option/name/${name}`,

        // Cập nhật phương thức thanh toán theo ID
        update: (id: string | number) => `/payment-method-option/${id}`,

        // Xóa phương thức thanh toán theo ID
        delete: (id: string | number) => `/payment-method-option/${id}`,
    },

    //
    // delivery
};

export default endpoints;

export type CreateContactDto = {
    name: string;
    phone: string;
    email: string;
    note?: string;
    product_name?: string | null;
    service: EnumContact;
    maintenance_date?: string;
};

export type UpdateContactDto = {
    id: string;
    name?: string;
    phone?: string;
    email?: string;
    note?: string;
    product_name?: string | null;
    service?: EnumContact;
    maintenance_date?: string;
};

export enum EnumContact {
    Quote = "Báo giá sản phẩm",
    Order = "Đặt hàng sản phẩm",
    Maintenance = "Đặt lịch bảo dưỡng",
}
export type ContactResponseType = {
    id: string;
    name: string;
    phone: string;
    email: string;
    note: string;
    order_product_name: string | null;
    service: EnumContact;
    maintenance_date: string;
    updatedAt: string;
    createdAt: string;
};

export type globalFilterContactType = {
    search?: string;
    created_from?: string;
    created_to?: string;
    service?: EnumContact;
};

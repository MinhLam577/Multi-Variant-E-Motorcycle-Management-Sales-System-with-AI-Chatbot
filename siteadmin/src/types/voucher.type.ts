export type TypeVoucher = {
    id: string;
    name_type_voucher: string;
};

export interface Voucher {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    voucher_code: string;
    voucher_name: string;
    description: string;
    uses: number;
    limit: number;
    max_uses_user: number;
    discount_amount: string;
    fixed: boolean;
    status: string;
    start_date: string;
    end_date: string;
    count_user_get: number;
    type_voucher?: TypeVoucher;
}

export interface VoucherResponse {
    data: Voucher[];
    status: number;
    message: string;
}
export interface TypeVoucherResponse {
    data: TypeVoucher[];
    status: number;
    message: string;
}

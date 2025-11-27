import { EnumOrderStatusesValue } from "@/constants";
import {
    EnumTypeOfTimeStatistics,
    StatisticsResponse,
} from "@/pages/adminOverview/Overview";
import { SkusDataResponseType } from "./product.type";
import { PaymentMethodResponseType } from "./payment.type";

import {
    CustomerResponseType,
    ReceiveAddressResponseType,
} from "./user-staff.type";
export class order_detail_dto {
    skus_id: string;
    quantity: number;
}

export type CreateOrderDto = {
    customer_id: string;
    receive_address_id: string;
    total_price: number;
    discount_price: number;
    order_note?: string;
    payment_method_id: string;
    delivery_method_id: string;
    order_details: order_detail_dto[];
};

export type RevenueProfitStatisticsDto = {
    time_type: EnumTypeOfTimeStatistics;
    year?: number;
    startMonth?: number;
    endMonth?: number;
    month?: number;
    startDay?: number;
    endDay?: number;
};

export type OrderDetailResponseType = {
    id: string;
    customer: CustomerResponseType;
    receive_address: ReceiveAddressResponseType;
    order_status: string;
    note: string | null;
    order_details: OrderDetailDataResponseType[];
    total_price: number;
    discount_price: number;
    payment_method: PaymentMethodResponseType;
    payment_status: string;
    delivery_method: DeliveryMethodResponseType;
    delivery_time: string | null;
    refund_time: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type DeliveryMethodResponseType = {
    id: string;
    name: string;
    description: string;
    logo: string | null;
};
export type OrderStatusStaticsResponseType = {
    [K in Exclude<keyof typeof EnumOrderStatusesValue, "All">]: number;
};
export type OrderStatus = {
    key?: string;
};

export type OrderDetailDataResponseType = {
    id: string;
    quantity: number;
    skus: SkusDataResponseType & {
        product: {
            id: string;
            title: string;
        };
    };
};

export type globalFiltersDataOrder = {
    search?: string;
    sortOrder?: string;
    sortBy?: string;
    order_status?: Omit<EnumOrderStatusesValue, "All">;
    payment_status?: string;
    payment_method?: string;
    delivery_method?: string;
    created_from?: string;
    created_to?: string;
};

export type orderData = {
    orders: OrderDetailResponseType[];
    order_status: EnumOrderStatusesValue[];
    order_status_selected?: string;
    order_selected?: string;
    order_detail?: OrderDetailResponseType;
    confirm_order_data?: ExportOrder;
    revenue_profit_statistics?: StatisticsResponse;
    total_revenue_by_year?: number;
    order_status_statics?: OrderStatusStaticsResponseType[];
};

export interface CreateDetailExport {
    quantity_export: number;
    skus_id: string;
    detail_import_id: string;
    warehouse_id: string;
    order_id?: string;
}

export interface ExportOrder {
    note?: string;
    order_id: string;
    detail_export: CreateDetailExport[];
}

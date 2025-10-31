export type DeliveryMethodResponseType = {
    id: string;
    name: string;
    description: string;
    fee: number;
    logo: string | null;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type PaymentMethodResponseType = {
    id: string;
    name: string;
    description: string;
    logo: string | null;
};

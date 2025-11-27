import { RoleEnum } from "@/constants";

export type ReceiveAddressResponseType = {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    address: string;
    postal_code: string;
    note: string;
};

export type PermissionType = {
    id: string;
    name: string;
    path: string;
    method: string;
    module: string;
};
export type RoleType = {
    id: string;
    name: RoleEnum;
    permissions: PermissionType[];
};

export enum GenderEnum {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
}

export interface UpdateUserDto {
    username?: string;
    email?: string;
    age?: number;
    address?: string;
    phoneNumber?: string;
    gender?: GenderEnum;
    avatarUrl?: string;
    Roles?: RoleEnum;
    birthday?: string | null;
}

export type UpdateUserStaffType = {};

export type UserStaffResponseType = {
    id: string;
    username: string;
    email: string;
    age: number;
    address: string;
    avatarUrl: string;
    phoneNumber: string | null;
    birthday: string | null;
    gender: GenderEnum;
    joinedAt: string;
    isActive: boolean;
    roles: RoleType[];
};

export type CustomerResponseType = {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
};

export type globalFiltersDataUserStaff = {
    search?: string;
    sortOrder?: string;
    created_from?: string;
    created_to?: string;
    status?: boolean;
};

export type userStoreData = {
    listData: UserStaffResponseType[];
    detail: UserStaffResponseType | null;
};

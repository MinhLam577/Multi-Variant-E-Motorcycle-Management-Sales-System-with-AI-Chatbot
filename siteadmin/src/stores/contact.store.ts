import { makeAutoObservable, toJS } from "mobx";
import { paginationData, RootStore } from "./base";
import { convertDate, filterEmptyFields, getErrorMessage } from "src/utils";
import { DateTimeFormat } from "src/constants";
import ContactAPI from "src/api/contact.api";

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

class ContactObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: ContactResponseType[] = [];
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this, {}, { autoBind: true });
    }
    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFilterContactType & paginationData = {
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query
                  ? query
                  : {}),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterContactType =
            filterEmptyFields({
                ...this.pagination,
                ...parsedQuery,
                search: parsedQuery?.search?.trim(),
                created_from: parsedQuery?.created_from
                    ? convertDate(
                          parsedQuery.created_from,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
                created_to: parsedQuery?.created_to
                    ? convertDate(
                          parsedQuery.created_to,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
            });

        // Tạo query string
        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(filters).map(([key, value]) => [
                    key,
                    String(value),
                ])
            )
        ).toString();
        return queryString;
    }

    *getListContact(query: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response = yield ContactAPI.list(queryString);
            const { data, status, message } = response;
            const resData = toJS(data?.contact);
            const success_status = [200, 201, 204];
            const newUrl = `${window.location.pathname}?${queryString}`;
            if (newUrl.includes("contact")) {
                window.history.replaceState({}, "", newUrl);
            }
            if (success_status.includes(status)) {
                this.data = resData;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.log("Error fetching contact data:", e);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi khi lấy danh sách thông tin liên hệ"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "");
        } finally {
            this.loading = false;
        }
    }

    *createContact(data: CreateContactDto) {
        try {
            const response = yield ContactAPI.create(data);
            const { data: resData, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.log("Error creating contact:", e);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi khi tạo thông tin liên hệ"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "");
        }
    }

    *updateContact(id: string, data: Omit<UpdateContactDto, "id">) {
        try {
            const response = yield ContactAPI.update(id, data);
            const { data: resData, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return resData;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            console.log("Error updating contact:", e);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi khi cập nhật thông tin liên hệ"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "");
        }
    }

    *deleteContact(id: string) {
        try {
            const response = yield ContactAPI.delete(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.log("Error deleting contact:", e);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi khi xóa thông tin liên hệ"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "");
        }
    }
}

export default ContactObservable;

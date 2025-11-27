import { flow, makeAutoObservable } from "mobx";
import { paginationData, RootStore } from "./base";
import BrandAPI from "@/api/brand.api";
import { convertDate, filterEmptyFields, getErrorMessage } from "@/utils";
import { DateTimeFormat } from "@/constants";
import {
    BrandResponseType,
    CreateBrandDto,
    globalFilterBrandType,
    UpdateBrandDto,
} from "@/types/brand.type";
class BrandObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: BrandResponseType[] = [];
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(
            this,
            {
                getListBrands: flow,
                createBrand: flow,
                deleteBrand: flow,
                updateBrand: flow,
            },
            { autoBind: true }
        );
    }
    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFilterBrandType & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterBrandType =
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

    *getListBrands(query: string | object) {
        try {
            const queryString = this.validateQuery(query);
            const response = yield BrandAPI.list(queryString);
            const { data, status, message } = response;
            const resData = data?.result;
            const success_status = [200, 201, 204];
            const newUrl = `${window.location.pathname}?${queryString}`;
            if (newUrl.includes("brands")) {
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
            console.error(e);
            this.rootStore.status = 500;
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi lấy danh sách thương hiệu"
            );
            this.rootStore.errorMsg = errorMessage;
        }
    }

    *createBrand(brand: CreateBrandDto) {
        try {
            const response = yield BrandAPI.create(brand);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                yield this.getListBrands({
                    ...this.pagination,
                });
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi tạo thương hiệu"
            );
            this.rootStore.errorMsg = errorMessage;
        }
    }

    *updateBrand(id: string, brand: UpdateBrandDto) {
        try {
            const response = yield BrandAPI.update(id, brand);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                yield this.getListBrands({
                    ...this.pagination,
                });
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi cập nhật thương hiệu"
            );
            this.rootStore.errorMsg = errorMessage;
        }
    }

    *deleteBrand(id: string) {
        try {
            const response = yield BrandAPI.delete(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                yield this.getListBrands({
                    ...this.pagination,
                });
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi xóa thương hiệu"
            );
            this.rootStore.errorMsg = errorMessage;
        }
    }
}

export default BrandObservable;

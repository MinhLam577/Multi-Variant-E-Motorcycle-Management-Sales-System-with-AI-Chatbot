import { makeAutoObservable, toJS } from "mobx";

import { RootStore } from "./base";
import { getBlogDetails, getListBlog } from "../api/blog";
import { filterEmptyFields } from "@/utils";
import { convertDate, DateTimeFormat } from "../constants";

export type BlogResponseType = {
    id: string;
    title: string;
    thumbnail: string;
    content: string;
    blogImages: string[];
    slug: string;
    blogCategoryId: string;
    customerId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type globalFilterBlogData = {
    search?: string;
    blog_category_id?: string;
    created_from?: string;
    created_to?: string;
};
export type TypeVoucher = {
    id: string;
    name_type_voucher: string;
};

export type paginationData = {
    current: number;
    pageSize: number;
};

export default class BlogsObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data: BlogResponseType[] = null;
    dataById: BlogResponseType = null;
    nextData: BlogResponseType[] = null;
    prevData: BlogResponseType[] = null;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    globalFilter: globalFilterBlogData = {
        search: undefined,
        blog_category_id: undefined,
        created_from: undefined,
        created_to: undefined,
    };
    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }
    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFilterBlogData & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterBlogData =
            filterEmptyFields({
                ...this.pagination,
                ...parsedQuery,
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
                search: parsedQuery?.search?.trim(),
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
    *getListBlog(query?: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response = yield getListBlog(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data = data?.data;
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = Array.isArray(message)
                    ? message.join(", ")
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *getListBlogById(id: string) {
        try {
            this.loading = true;
            const response = yield getBlogDetails(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.dataById = data;
            } else {
                this.errorMsg = Array.isArray(message)
                    ? message.join(", ")
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *getBlogDetails(id: string) {
        try {
            this.loading = true;
            const response = yield getBlogDetails(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            console.log("getBlogDetails response", toJS(response));
            if (success_status.includes(status)) {
                this.dataById = data;
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = Array.isArray(message)
                    ? message.join(", ")
                    : message;
            }
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    setGlobalFilter(filter: globalFilterBlogData) {
        this.globalFilter = {
            ...this.globalFilter,
            ...filter,
        };
    }

    clearMessage() {
        this.showSuccessMsg = false;
        this.status = null;
        this.errorMsg = null;
        this.successMsg = null;
    }

    setStatusMessage(
        status?: number,
        errorMsg?: string,
        successMsg?: string,
        showSuccessMsg?: boolean
    ) {
        if (showSuccessMsg) {
            this.showSuccessMsg = showSuccessMsg;
        }
        if (status) {
            this.status = status;
        }
        if (errorMsg) {
            this.errorMsg = errorMsg;
        }
        if (successMsg) {
            this.successMsg = successMsg;
        }
    }

    setPagination(page: number, pageSize: number) {
        if (page < 1 || pageSize < 1) return;

        this.pagination = {
            ...this.pagination,
            current: page,
            pageSize: pageSize,
        };
    }

    setIsOpenDetail(isOpen: boolean) {
        this.isOpenDetail = isOpen;
    }

    // Lấy data ở sau current hiện tại
    get NextDataById() {
        if (this.dataById) {
            const currentIndex = this.data?.findIndex(
                (item) => item.id === this.dataById.id
            );
            if (currentIndex !== -1 && currentIndex < this.data.length - 1) {
                return this.data[currentIndex + 1];
            }
        }
        return null; // Không có phần tử tiếp theo
    }

    // Lấy data ở trước current hiện tại
    get PrevDataById() {
        if (this.dataById) {
            const currentIndex = this.data?.findIndex(
                (item) => item.id === this.dataById.id
            );
            if (currentIndex > 0) {
                return this.data[currentIndex - 1];
            }
        }
        return null; // Không có phần tử hiện tại
    }
}

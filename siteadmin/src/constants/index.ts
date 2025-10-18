import dayjs from "dayjs";
export const Language = {
    english: "en",
    vietnamese: "vi",
};

export const RequestStatus = {
    INITIAL: "initial",
    SUBMITTING: "submitting",
    FETCH_SUCCESS: "fetchSuccess",
    FETCH_FAILED: "fetchFailed",
    FETCH_DETAIL_SUCCESS: "fetchDetailSuccess",
    FETCH_DETAIL_FAILED: "fetchDetailFailed",
};

export const keyStorageAccount = "account";
export const ColorList = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae"];
export const UserRoleConstant = {
    Staff: "Staff",
    warehouse_manager: "warehouse_manager",
    delivery_staff: "delivery_staff",
    admin: "admin",
};

export const Status = {
    New: "new",
    InActive: "inactive",
    Active: "active",
};

export const StatusColor = {
    New: "#f56a00",
    InActive: "#7265e6",
    Active: "#00a2ae",
};

export const EventType = {
    Online: "online",
    Offline: "offline",
};

export const EventScope = {
    Private: "private",
    Public: "public",
};

export const ResourceCategory = {
    avatar: "avatar",
    image: "image",
    video: "video",
    other: "other",
};

export const DataImportType = {
    UserImport: "UserImport",
};

export const TicketTransactionStatus = {
    New: "new",
    Completed: "completed",
};

export const TicketTransactionStatusText = {
    [TicketTransactionStatus.New]: "Chưa duyệt",
    [TicketTransactionStatus.Completed]: "Đã duyệt",
};

export const DefaultValues = {
    DatePickerValue: dayjs(new Date())
        .set("millisecond", 0)
        .set("second", 0)
        .set("minute", 0)
        .set("hour", 0),
};

export enum DateTimeFormat {
    TimeStamp = "DD/MM/YYYY HH:mm:ss",
    TimeStampExcludedSeconds = "DD/MM/YYYY HH:mm",
    Date = "DD/MM/YYYY",
    DateJS = "YYYY-MM-DD",
    TIME_STAMP_POSTGRES = "YYYY-MM-DD HH:mm:ss",
    TIME_STAMP_ISO = "YYYY-MM-DDTHH:mm:ssZ",
    TIME_STAMP_POSTGRES_TZ = "YYYY-MM-DDTHH:mm:ss.SSSZ",
}

export const RegExps = {
    ImageType: /^image\//,
    IdentityNo: /^([0-9]{9}|[0-9]{12})$/,
    PhoneNumber:
        /^(0|84)((3[2-9])|(5[2689])|(7[06789])|(8[12345689])|(9[012346789]))\d{7}$/,
    Email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const AntdTableSelectionType = {
    All: "all",
    Single: "single",
};

export const AntdTableLocale = {
    emptyText: "Không có dữ liệu",
    sortTitle: "Sắp xếp",
    triggerAsc: "Sắp xếp tăng dần",
    triggerDesc: "Sắp xếp giảm dần",
    cancelSort: "Hủy sắp xếp",
};

export const AntdTablePagingLocale = {
    items_per_page: "/ Trang",
    jump_to: "Nhảy tới",
    jump_to_confirm: "Xác nhận nhảy tới",
    next_page: "Trang sau",
    page: "Trang",
    prev_page: "Trang trước",
};

export const EnumOrderStatuses = {
    All: "Tất cả",
    PENDING: "ĐANG CHỜ",
    CONFIRMED: "ĐÃ XÁC NHẬN",
    EXPORTED: "ĐÃ XUẤT KHO",
    HAND_OVERED: "ĐÃ BÀN GIAO",
    DELIVERING: "ĐANG VẬN CHUYỂN",
    SHIPPING: "ĐANG GIAO HÀNG",
    DELIVERED: "GIAO THÀNH CÔNG",
    CANCELLED: "HỦY ĐƠN",
    FAILED_DELIVERY: "GIAO THẤT BẠI",
};

export const EnumOrderSteps = {
    PENDING: "Đang XỬ LÍ",
    CONFIRMED: "ĐÃ XÁC NHẬN",
    EXPORTED: "ĐÃ XUẤT KHO",
    HAND_OVERED: "ĐÃ BÀN GIAO",
    DELIVERING: "VẬN CHUYỂN",
    SHIPPING: "GIAO HÀNG",
};

export enum EnumOrderStatusesValue {
    All = null as any,
    CANCELLED = -1, // Đã hủy đơn hàng
    PENDING = 0, // Đang chờ xử lí
    CONFIRMED = 1, // Đã xác nhận đơn hàng và chờ hàng xuất kho
    EXPORTED = 2, // Đã xuất kho thành công và chuẩn bị bàn giao cho đơn vị vận chuyển
    HAND_OVERED = 3, // Đã bàn giao hàng cho đơn vị vận chuyển
    DELIVERING = 4, // Đang vận chuyển hàng từ nơi xa về gần nơi của khách hàng
    SHIPPING = 5, // Hàng đã đến gần khách và đang trong quá trình giao trực tiếp
    DELIVERED = 6, // Đã giao hàng thành công
    FAILED_DELIVERY = 7, // Giao hàng thất bại
}

export const EnumOrderColorStatuses = {
    PENDING: "rgb(2,132,199)",
    CONFIRMED: "#003eb3",
    EXPORTED: "#389e0d",
    HAND_OVERED: "#fadb14",
    DELIVERING: "#876800",
    SHIPPING: "#006d75",
    DELIVERED: "rgb(5,150,105)",
    CANCELLED: "#9e1068",
    RETURNED: "#531dab",
    FAILED_DELIVERY: "#f5222d",
};

export const PaymentStatus = {
    PENDING: "ĐANG XỬ LÝ",
    PAID: "ĐÃ THANH TOÁN",
    FAILED: "THẤT BẠI",
    REFUNDED: "ĐÃ HOÀN TIỀN",
    CANCELLED: "ĐÃ HỦY",
    PROCESSING: "ĐANG XỬ LÝ",
    EXPIRED: "ĐÃ HẾT HẠN",
};

export enum payment_status {
    FAILED = -1,
    PENDING = 0,
    PAID = 1,
    REFUNDED = 2,
    CANCELLED = 3,
    PROCESSING = 4,
    EXPIRED = 5,
}

export const EnumPaymentStatusColors = {
    PENDING: "rgb(2 132 199)",
    PAID: "rgb(34 197 94)",
    FAILED: "rgb(239 68 68)",
    REFUNDED: "rgb(249 115 22)",
    CANCELLED: "rgb(156 163 175)",
    PROCESSING: "rgb(245 158 11)",
    EXPIRED: "rgb(156 163 175)",
};

export const NewsStatus = {
    Inactive: "inactive",
    Active: "active",
};

export const NewsStatusLabel = {
    [NewsStatus.Inactive]: "Không hiển thị",
    [NewsStatus.Active]: "Hiển thị",
};

export enum RoleEnum {
    USER = "user",
    STAFF = "staff",
    WAREHOUSE_MANAGER = "warehouse_manager",
    DELIVERY_STAFF = "delivery_staff",
    ADMIN = "admin",
}

export enum RoleEnumValue {
    USER = "Khách hàng",
    STAFF = "Nhân viên bán hàng",
    WAREHOUSE_MANAGER = "Quản lý kho",
    DELIVERY_STAFF = "Nhân viên giao hàng",
    ADMIN = "Admin",
}

export const CustomerType = {
    user: "Khách hàng",
};
export const GenderType = {
    male: "male",
    female: "female",
    other: "khác",
};

export const WareHouseDetailMode = {
    View: 1,
    Add: 2,
    Edit: 3,
};

export const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: "hs_client_access_token",
    REFRESH_TOKEN: "hs_client_refresh_token",
};

export const SUCCESS_STATUSES = [200, 201, 204];
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const AcceptImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
];

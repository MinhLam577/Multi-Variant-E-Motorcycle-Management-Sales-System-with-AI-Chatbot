import * as dayjs from "dayjs";

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
  ADMIN: "admin",
  USER: "user",
  SALES: "sales",
};

export const Status = {
  New: "new",
  InActive: "inactive",
  Active: "active",
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

export const DateTimeFormat = {
  TimeStamp: "DD/MM/YYYY HH:mm:ss",
  TimeStampExcludedSeconds: "DD/MM/YYYY HH:mm",
  Date: "DD/MM/YYYY",
};

export const RegExps = {
  ImageType: /^image\//,
  IdentityNo: /^([0-9]{9}|[0-9]{12})$/,
  PhoneNumber:
    /^(0|84)((3[2-9])|(5[2689])|(7[06789])|(8[12345689])|(9[012346789]))\d{7}$/,
  Email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
  NEW: "MỚI",
  CONFIRMED: "ĐÃ XÁC NHẬN",
  PACKAGED: "ĐÃ ĐÓNG GÓI",
  DELIVERING: "ĐÃ GIAO DVVC",
  DELIVERED: "GIAO THÀNH CÔNG",
  FAILED: "THẤT BẠI",
  COMPLETED: "HOÀN THÀNH",
  CANCELED: "HỦY ĐƠN",
};

export const EnumOrderColorStatuses = {
  NEW: "rgb(2 132 199)",
  CONFIRMED: "rgb(34 197 94)",
  PACKAGED: "rgb(123 245 66)",
  DELIVERING: "rgb(234 179 8)",
  DELIVERED: "rgb(163 230 53)",
  COMPLETED: "rgb(5 150 105)",
  CANCELED: "rgb(239 68 68)",
  FAILED: "rgb(239 68 68)",
};

export const NewsStatus = {
  Inactive: "inactive",
  Active: "active",
};

export const NewsStatusLabel = {
  [NewsStatus.Inactive]: "Không hiển thị",
  [NewsStatus.Active]: "Hiển thị",
};

export const UserType = {
  user: "Khách hàng",
  hr: "Tuyển dụng",
  sales: "Sales",
};
export const WareHouseDetailMode = {
  View: 1,
  Add: 2,
  Edit: 3,
};

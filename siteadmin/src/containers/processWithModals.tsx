import { Modal } from "antd";

export const ProcessModalName = {
    ConfirmLogout: "Logout",
    ConfirmSaveEditing: "SaveEditing",
    ConfirmCancelEditing: "CancelEditing",
    ConfirmChangePassword: "ChangePassword",
    ConfirmCreateUser: "CreateUser",
    ConfirmUpdateUser: "UpdateUser",
    ConfirmCreateNews: "CreateNews",
    ConfirmUpdateNews: "UpdateNews",
    ConfirmCreateEvent: "CreateEvent",
    ConfirmUpdateEvent: "UpdateEvent",
    ConfirmAddUsersToEvent: "ConfirmAddUsersToEvent",
    ConfirmAddModerators: "ConfirmAddModerators",
    ConfirmSendNotification: "ConfirmSendNotification",
    ConfirmCustomContent: "ConfirmCustomContent",
    ConfirmCreateStores: "CreateStore",
    ConfirmUpdateStores: "UpdateStore",
};

export const confirmModal = (
    title: string,
    content: string,
    okCallback: () => void = () => {},
    cancelCallback: () => void = () => {}
) => {
    Modal.confirm({
        title,
        content,
        onOk: okCallback,
        onCancel: cancelCallback,
    });
};

const informModal = (title = "Thông tin", content = "Thông tin") => {
    return (cancelCallback: () => void = () => {}) => {
        Modal.info({
            title: title,
            content: content,
            cancelText: "Đóng",
            onCancel: cancelCallback,
        });
    };
};

interface ProcessWithModalsOptions {
    modalName: string;
    title?: string;
    content?: string;
    onOk?: () => void;
    onCancel?: () => void;
}

export const processWithModals = ({
    modalName,
    title,
    content,
    onOk,
    onCancel,
}: ProcessWithModalsOptions): void => {
    switch (modalName) {
        // ==== HỆ THỐNG ====
        case ProcessModalName.ConfirmLogout:
            return confirmModal(
                "Xác nhận",
                "Bạn chắc chắn muốn đăng xuất?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmSaveEditing:
            return confirmModal(
                "Xác nhận",
                "Bạn chắc chắn muốn lưu thông tin đang chỉnh sửa?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmCancelEditing:
            return confirmModal(
                "Xác nhận",
                "Bạn chắc chắn muốn hủy thay đổi?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmChangePassword:
            return confirmModal(
                "Xác nhận",
                "Bạn chắc chắn muốn thay đổi mật khẩu?",
                onOk,
                onCancel
            );

        // ==== USER ====
        case ProcessModalName.ConfirmCreateUser:
            return confirmModal(
                "Tạo người dùng",
                "Bạn chắc chắn muốn tạo người dùng mới?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmUpdateUser:
            return confirmModal(
                "Cập nhật người dùng",
                "Bạn chắc chắn muốn cập nhật thông tin người dùng?",
                onOk,
                onCancel
            );

        // ==== NEWS ====
        case ProcessModalName.ConfirmCreateNews:
            return confirmModal(
                "Tạo bài viết",
                "Bạn chắc chắn muốn tạo bài viết mới?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmUpdateNews:
            return confirmModal(
                "Cập nhật bài viết",
                "Bạn chắc chắn muốn cập nhật bài viết?",
                onOk,
                onCancel
            );

        // ==== EVENT ====
        case ProcessModalName.ConfirmCreateEvent:
            return confirmModal(
                "Tạo sự kiện",
                "Bạn chắc chắn muốn tạo sự kiện mới?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmUpdateEvent:
            return confirmModal(
                "Cập nhật sự kiện",
                "Bạn chắc chắn muốn cập nhật sự kiện?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmAddUsersToEvent:
            return confirmModal(
                "Thêm người dùng",
                "Bạn chắc chắn muốn thêm người dùng vào sự kiện?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmAddModerators:
            return confirmModal(
                "Thêm quản trị viên",
                "Bạn chắc chắn muốn thêm quản trị viên cho sự kiện?",
                onOk,
                onCancel
            );

        // ==== NOTIFICATION ====
        case ProcessModalName.ConfirmSendNotification:
            return confirmModal(
                "Gửi thông báo",
                "Bạn chắc chắn muốn gửi thông báo này?",
                onOk,
                onCancel
            );

        // ==== STORES ====
        case ProcessModalName.ConfirmCreateStores:
            return confirmModal(
                "Tạo cửa hàng",
                "Bạn chắc chắn muốn tạo cửa hàng mới?",
                onOk,
                onCancel
            );

        case ProcessModalName.ConfirmUpdateStores:
            return confirmModal(
                "Cập nhật cửa hàng",
                "Bạn chắc chắn muốn cập nhật thông tin cửa hàng?",
                onOk,
                onCancel
            );

        // ==== CUSTOM ====
        case ProcessModalName.ConfirmCustomContent:
            return confirmModal(
                title ?? "Xác nhận",
                content ?? "",
                onOk,
                onCancel
            );

        // ==== FALLBACK ====
        default:
            return informModal(
                "Thông báo",
                "Không tìm thấy loại modal phù hợp"
            )(onCancel);
    }
};

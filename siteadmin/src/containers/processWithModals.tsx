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

// const confirmModal = (
//     title = "Xác nhận",
//     content = "Bạn chắc chắn muốn thực hiện hành động này?"
// ) => {
//     return (okCallback?: () => void, cancelCallback?: () => void) => {
//         Modal.confirm({
//             title,
//             content,
//             onOk: okCallback,
//             onCancel: cancelCallback,
//         });
//     };
// };

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

// export const processWithModals = ({
//     modalName,
//     title,
//     content,
//     onOk,
//     onCancel,
// }: ProcessWithModalsOptions) => {
//     switch (modalName) {
//         case ProcessModalName.ConfirmLogout:
//             return confirmModal("Xác nhận", "Bạn chắc chắn muốn đăng xuất?");
//         case ProcessModalName.ConfirmSaveEditing:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn lưu thông tin đang chỉnh sửa?"
//             );
//         case ProcessModalName.ConfirmCancelEditing:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn hủy thông tin đang chỉnh sửa?"
//             );
//         case ProcessModalName.ConfirmChangePassword:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chăc chắn muốn thay đổi mật khẩu?"
//             );
//         case ProcessModalName.ConfirmCreateUser:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn tạo người dùng với các thông tin này?"
//             );
//         case ProcessModalName.ConfirmUpdateUser:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn thay đổi thông tin của người dùng này?"
//             );
//         case ProcessModalName.ConfirmCreateNews:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn tạo tin tức với các thông tin này?"
//             );
//         case ProcessModalName.ConfirmUpdateNews:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn cập nhật tin tức này?"
//             );
//         case ProcessModalName.ConfirmCreateEvent:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn tạo khóa học với các thông tin này?"
//             );
//         case ProcessModalName.ConfirmUpdateEvent:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn cập nhật khóa học này?"
//             );
//         case ProcessModalName.ConfirmAddUsersToEvent:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn thêm những người dùng này vào khóa học?"
//             );
//         case ProcessModalName.ConfirmAddModerators:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn thêm những người dùng này vào vai trò Cộng tác viên?"
//             );
//         case ProcessModalName.ConfirmSendNotification:
//             return confirmModal(
//                 "Xác nhận",
//                 "Bạn chắc chắn muốn gửi thông báo này cho những người dùng đã chọn?"
//             );
//         case ProcessModalName.ConfirmCustomContent:
//             return (title, content) => confirmModal(title, content);
//         default:
//             return informModal();
//     }
// };

export const processWithModals = ({
    modalName,
    title,
    content,
    onOk,
    onCancel,
}: ProcessWithModalsOptions): void => {
    switch (modalName) {
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
                "Bạn chắc chắn muốn hủy thông tin đang chỉnh sửa?",
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

        case ProcessModalName.ConfirmCustomContent:
            return confirmModal(
                title ?? "Xác nhận",
                content ?? "",
                onOk,
                onCancel
            );

        default:
            informModal();
            break;
    }
};

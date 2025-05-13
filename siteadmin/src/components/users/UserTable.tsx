import { Button } from "antd";
import { useNavigate } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals.js";
import TableComponent from "../../containers/TableComponent";
import { RoleType, UserStaffResponseType } from "src/stores/user.store";
import React from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";

interface IColumnsConfig {
    handleViewUser: (user: UserStaffResponseType) => void;
}

const getColumnsConfig = ({ handleViewUser }: IColumnsConfig) => {
    return [
        {
            title: "Họ tên",
            dataIndex: "username",
            key: "username",
            render: (value, item) => {
                return (
                    <Button
                        className="!p-0"
                        type="link"
                        onClick={() => handleViewUser(item)}
                    >
                        {value}
                    </Button>
                );
            },
            width: "140px",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "140px",
            ellipsis: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: "140px",
            ellipsis: true,
        },

        {
            title: "Ngày sinh",
            dataIndex: "birthday",
            key: "birthday",
            width: "140px",
            ellipsis: true,
        },

        {
            title: "Vai trò",
            dataIndex: "roles",
            key: "roles",
            width: "200px",
            ellipsis: true,
            render: (Roles: RoleType[]) => {
                if (!Roles || Roles.length === 0) return "Chưa có vai trò";

                return Roles.map((role) => role?.name).join(", "); // Hiển thị danh sách tên vai trò, cách nhau bởi dấu phẩy
            },
        },
    ];
};

interface IUserTableProps {
    data: UserStaffResponseType[];
    handleUpdateUser: (user: UserStaffResponseType) => void;
    handleViewUser: (user: UserStaffResponseType) => void;
}

const UserTable: React.FC<IUserTableProps> = ({
    data,
    handleUpdateUser,
    handleViewUser,
}) => {
    const navigate = useNavigate();
    const store = useStore();
    const userStore = store.userStaffObservable;
    const handleResetPassword = (id: string) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?"
        )(() => {});
    };

    const handleDeleteUser = (id: string) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn có chắc chắn ngưng hoạt động của người dùng này?"
        )(() => {});
    };
    const hanleAddressUser = (item) => {
        navigate(`/users/${item}/address`, { replace: true });
    };

    const hanleActivateUser = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn active lại người dùng này ?"
        )(() => {});
    };

    return (
        <>
            <TableComponent
                loading={userStore.loading}
                filtersInput="filters"
                getColumnsConfig={getColumnsConfig}
                loadData={() => {}}
                data={data}
                handleResetPassword={handleResetPassword}
                handleDeleteUser={handleDeleteUser}
                handleUpdateUser={handleUpdateUser}
                handleViewUser={handleViewUser}
                hanleActivateUser={hanleActivateUser}
                hanleAddressUser={hanleAddressUser}
                scroll={{ y: "200px" }}
                observableName={userStore.constructor.name}
            />
        </>
    );
};
export default observer(UserTable);

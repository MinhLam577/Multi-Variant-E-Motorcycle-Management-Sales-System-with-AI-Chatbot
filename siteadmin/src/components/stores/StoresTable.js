import { Button, message, Tag } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat } from "../../constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

const getColumnsConfig = ({
    handleUpdateStores,
    handleViewStores,
    hanleDeleteStore,
    handleEditStores,
}) => {
    return [
        {
            title: "Tên cửa hàng",
            dataIndex: "name",
            key: "name",
            render: (value, item) => {
                return (
                    <Button
                        type="link"
                        className="custom-antd-btn-ellipsis-content !p-0"
                        onClick={() => handleViewStores(item)}
                    >
                        {value}
                    </Button>
                );
            },
            sorter: true,
            ellipsis: true,
            width: "140px",
        },

        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
            width: "200px",
        },

        {
            title: "Trạng thái",
            dataIndex: "active",
            key: "active",
            render: (active) => (
                <Tag
                    className="uppercase"
                    color={
                        active === true
                            ? "#87d068"
                            : active === false
                            ? "#ff4d4f"
                            : "#108ee9"
                    }
                >
                    {active === true ? "Hiển thị" : "Không Hiển thị"}
                </Tag>
            ),
            ellipsis: true,
            width: "100px",
        },
        {
            title: "Thời gian tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) =>
                moment(createdAt).format(DateTimeFormat.TimeStamp),
            sorter: true,
            ellipsis: true,
            width: "140px",
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        item={item}
                        handleUpdate={handleEditStores}
                        hanleDelete={hanleDeleteStore}
                    />
                );
            },
            width: 100,
        },
    ];
};

const StoresTable = ({
    data,
    loading,
    globalFilters,
    handleUpdateStores,
    handleViewStores,
    handleEditStores,
    fetchUsers,
}) => {
    const hanleDeleteStore = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn xóa cửa hàng này?"
        )(async () => {
            try {
                await apiClient.delete(endpoints.branch.delete(id));
                message.success("Xóa cửa hàng thành công!");
                // Thêm logic cập nhật danh sách nếu cần
                fetchUsers();
            } catch (error) {
                console.error("Lỗi khi xóa cửa hàng:", error);
                message.error("Có lỗi xảy ra, vui lòng thử lại!");
            }
        });
    };

    return (
        <>
            <TableComponent
                loading={loading}
                filtersInput="filters"
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleEditStores,
                        handleViewStores,
                        hanleDeleteStore,
                    })
                }
                filterValue={globalFilters}
                loadData={() => {}}
                data={data}
                handleUpdateStores={handleUpdateStores}
            />
        </>
    );
};

StoresTable.propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    globalFilters: PropTypes.object,
    handleUpdateStores: PropTypes.func,
    handleViewStores: PropTypes.func,
    fetchUsers: PropTypes.func,
    handleEditStores: PropTypes.func,
};

export default StoresTable;

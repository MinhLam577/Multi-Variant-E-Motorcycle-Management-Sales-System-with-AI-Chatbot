import { Button, message } from "antd";
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
import { ALL_MODULES } from "../../constants/permissions.ts";

const getColumnsConfig = ({
    handleUpdateNews,
    handleViewNews,
    handleDeleteNews,
}) => {
    return [
        {
            title: "Tên danh mục tin tức",
            dataIndex: "name",
            key: "name",
            render: (value, item) => {
                return (
                    <span className="custom-antd-btn-ellipsis-content !p-0">
                        {value}
                    </span>
                );
            },
            ellipsis: true,
        },
        {
            title: "Tóm tắt",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Thời gian tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) =>
                moment(createdAt).format(DateTimeFormat.TimeStamp),
            sorter: true,
            ellipsis: true,
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        item={item}
                        handleDelete={handleDeleteNews}
                        handleUpdate={handleViewNews}
                        moduleName={ALL_MODULES.BLOGCATEGORY}
                    />
                );
            },
            width: 140,
        },
    ];
};

const NewsTable = ({
    data,
    loading,
    globalFilters,
    handleUpdateNews,
    handleViewNews,
    refreshData,
}) => {
    // Use fake newsList data

    const hanleActivateNews = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn đăng tải tin tức này lên?"
        )(() => {});
    };

    const hanleDeactivateNews = (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn gỡ bỏ tin tức này xuống?"
        )(() => {});
    };

    const handleDeleteNews = async (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn xóa danh mục tin tức này?"
        )(async () => {
            try {
                const { data } = await apiClient.delete(
                    endpoints.blogcategories.delete(id)
                );
                message.success(data?.message || "Xóa thành công");
                refreshData();
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                message.error(
                    error?.response?.data?.message ||
                        "Xóa thất bại, vui lòng thử lại!"
                );
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
                        handleUpdateNews,
                        handleDeleteNews,
                        handleViewNews,
                    })
                }
                filterValue={globalFilters}
                data={data}
                loadData={() => {
                    data;
                }}
                scroll={{ y: "200px" }}
            />
        </>
    );
};

NewsTable.propTypes = {
    globalFilters: PropTypes.object,
    handleUpdateNews: PropTypes.func,
    handleViewNews: PropTypes.func,
    refreshData: PropTypes.func,
    loading: PropTypes.bool,
    data: PropTypes.array.isRequired,
};

export default NewsTable;

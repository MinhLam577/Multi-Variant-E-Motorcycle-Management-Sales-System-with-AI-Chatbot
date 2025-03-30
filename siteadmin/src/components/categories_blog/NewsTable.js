import { Button, message } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat, Status } from "../../constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";
import { useNavigate } from "react-router";

const getColumnsConfig = ({
    handleUpdateNews,
    handleViewNews,

    hanleDeleteNews,
}) => {
    return [
        {
            title: "Tên danh mục tin tức",
            dataIndex: "name",
            key: "name",
            render: (value, item) => {
                return (
                    <Button
                        type="link"
                        className="custom-antd-btn-ellipsis-content !p-0"
                        onClick={() => handleViewNews(item)}
                    >
                        {value}
                    </Button>
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
                        hanleDeleteNews={hanleDeleteNews}
                        handleUpdateNews={handleUpdateNews}
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

    const hanleDeleteNews = async (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn xóa danh mục tin tức này?"
        )(async () => {
            try {
                const { data } = await apiClient.delete(
                    endpoints.blogcategories.delete(id)
                );
                message.success(data?.message || "Xóa thành công");
                refreshData(); // Gọi refreshData để làm mới danh sách sau khi xóa
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
                        hanleDeleteNews,
                        handleViewNews,
                    })
                }
                filterValue={globalFilters}
                data={data}
                loadData={() => {
                    data;
                }}
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

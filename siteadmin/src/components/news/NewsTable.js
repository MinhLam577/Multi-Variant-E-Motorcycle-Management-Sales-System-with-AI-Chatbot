import { Button, message, Popconfirm } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat, Status } from "../../constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { Link, useParams } from "react-router";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import { useEffect, useState } from "react";

const getColumnsConfig = ({ hanleDeleteNews, handleUpdateNews }) => {
    const { id } = useParams();
    return [
        {
            title: "Tiêu đề & Mô tả",
            key: "title_description",
            render: (_, item) => {
                return (
                    <Link
                        to={`/categorynews/${id}/news/${item.id}`}
                        className="flex items-center gap-4"
                    >
                        <img
                            src={item.thumbnail}
                            alt="thumbnail"
                            className="w-16 h-16 object-cover rounded cursor-pointer"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "/images/default_product_image.jpg";
                            }}
                        />
                        <div className="text-sm truncate max-h-24">
                            <h3 className="text-base font-semibold text-gray-800 truncate overflow-hidden whitespace-nowrap text-ellipsis max-h-6">
                                {item.title}
                            </h3>
                            <div
                                className="text-sm text-gray-500 truncate overflow-hidden whitespace-nowrap text-ellipsis max-h-6"
                                dangerouslySetInnerHTML={{
                                    __html: item.content,
                                }}
                            >
                                {item.description}
                            </div>
                        </div>
                    </Link>
                );
            },
            ellipsis: true,
            width: "100%",
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <div className="flex items-start justify-start h-16">
                        <div className="flex items-center justify-start">
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa tin tức này"}
                                description={
                                    "Bạn có chắc chắn muốn xóa tin tức này ?"
                                }
                                onConfirm={() => hanleDeleteNews(item.id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <span
                                    style={{
                                        cursor: "pointer",
                                        margin: "0 20px",
                                    }}
                                    className="text-lg"
                                >
                                    <DeleteTwoTone twoToneColor="#ff4d4f" />
                                </span>
                            </Popconfirm>
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer" }}
                                className="text-lg"
                                onClick={() => {
                                    handleUpdateNews(item);
                                }}
                            />
                        </div>
                    </div>
                );
            },
            width: 140,
        },
    ];
};

const NewsTable = ({
    globalFilters,
    handleUpdateNews,
    handleViewNews,

    fetchData,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0); // Lấy từ API

    // Use fake newsList data
    const [data, setData] = useState([]);
    const loading = false;
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(
                    endpoints.blogcategories.details(id)
                );
                setData(response.data.blogs); // nếu bạn muốn lưu vào state
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]); // nhớ thêm `id` vào dependency array

    const handleDeleteNews = async (id) => {
        try {
            const response = await apiClient.delete(endpoints.blogs.delete(id));
            message.success("Xóa thành công");
            fetchData();

            // Có thể cập nhật lại danh sách tin tức sau khi xóa thành công
        } catch (error) {
            console.error("Lỗi khi xóa tin tức:", error);
            message.success("Xóa thất bại");
        }
    };

    const handleChange = () => {};

    return (
        <>
            <TableComponent
                loading={loading}
                filtersInput="filters"
                getColumnsConfig={getColumnsConfig}
                filterValue={globalFilters}
                data={data}
                handleUpdateNews={handleUpdateNews}
                handleViewNews={handleViewNews}
                hanleDeleteNews={handleDeleteNews}
                onChange={handleChange}
                pagination={{
                    // position: ["bottomCenter"],
                    showSizeChanger: true,
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
                loadData={() => {}}
                showHeader={false}
                scroll={{ y: "200px" }}
            />
        </>
    );
};

NewsTable.propTypes = {
    globalFilters: PropTypes.object,
    handleUpdateNews: PropTypes.func,
    handleViewNews: PropTypes.func,
    dataNews: PropTypes.array.isRequired,
    fetchData: PropTypes.func,
};

export default NewsTable;

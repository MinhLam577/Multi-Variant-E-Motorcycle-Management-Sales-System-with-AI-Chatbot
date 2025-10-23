import { message, Popconfirm, Tooltip } from "antd";
import moment from "moment";
import { DateTimeFormat } from "../../constants";
import TableComponent from "../../containers/TableComponent";
import { Link, useParams } from "react-router";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import Access from "../../access/access";
import { ALL_PERMISSIONS } from "../../constants/permissions";
import { GlobalFilterNewsType } from "src/pages/news";

const getColumnsConfig = ({ hanleDeleteNews, handleUpdateNews }) => {
    const { id } = useParams();
    return [
        {
            title: "Bài viết",
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
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // tránh loop vô hạn
                                target.src =
                                    "/images/default_product_image.jpg";
                            }}
                        />
                        <Tooltip
                            title={
                                <div className="max-w-xs">
                                    <h3 className="text-base font-semibold text-gray-800">
                                        {item.title}
                                    </h3>
                                    <div
                                        className="text-sm text-gray-500"
                                        dangerouslySetInnerHTML={{
                                            __html: item.content,
                                        }}
                                    >
                                        {item.description}
                                    </div>
                                </div>
                            }
                            placement="topLeft"
                            trigger={["hover", "focus"]}
                            color="#fff"
                            styles={{
                                root: {
                                    maxWidth: "300px",
                                    maxHeight: "150px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    wordBreak: "break-word",
                                },
                            }}
                        >
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
                        </Tooltip>
                    </Link>
                );
            },
            ellipsis: true,
            width: "50%",
        },
        {
            title: "Ngày đăng",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => {
                return (
                    <span>
                        {moment(value).format(DateTimeFormat.TimeStamp)}
                    </span>
                );
            },
            width: "20%",
            responsive: ["xl"],
        },
        {
            title: "Ngày cập nhật",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (value) => {
                return (
                    <span>
                        {moment(value).format(DateTimeFormat.TimeStamp)}
                    </span>
                );
            },
            width: "20%",
            responsive: ["xl"],
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <div className="flex items-start justify-start h-16">
                        <div className="flex items-center justify-start">
                            <Access
                                permission={ALL_PERMISSIONS.BLOGS.DELETE}
                                hideChildren
                            >
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
                            </Access>

                            <Access
                                permission={ALL_PERMISSIONS.BLOGS.UPDATE}
                                hideChildren
                            >
                                <EditTwoTone
                                    twoToneColor="#f57800"
                                    style={{ cursor: "pointer" }}
                                    className="text-lg"
                                    onClick={() => {
                                        handleUpdateNews(item);
                                    }}
                                />
                            </Access>
                        </div>
                    </div>
                );
            },
            width: 40,
        },
    ];
};

interface NewsTableProps {
    data: any;
    handleUpdateNews: (data: any) => void;
    handleViewNews: (data: any) => void;
    globalFilters: GlobalFilterNewsType;
    fetchData: (query?: string | GlobalFilterNewsType) => Promise<void>;
    loading: boolean;
    setGlobalFilters?: any;
}

const NewsTable = ({
    data,
    globalFilters,
    setGlobalFilters,
    handleUpdateNews,
    handleViewNews,
    fetchData,
    loading = false,
}: NewsTableProps) => {
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
                pagination={{
                    showSizeChanger: true,
                    current: globalFilters.current,
                    pageSize: globalFilters.pageSize,
                    total: data && Array.isArray(data) ? data.length : 0,
                    onChange: (page, size) => {
                        setGlobalFilters({
                            ...globalFilters,
                            current: page,
                            pageSize: size,
                        });
                    },
                }}
                scroll={{ y: "200px" }}
            />
        </>
    );
};

export default NewsTable;

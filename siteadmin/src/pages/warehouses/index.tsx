import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Tag, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { GlobalContext } from "../../contexts/global";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout/index";
import CustomizeTab from "../../components/common/CustomizeTab";
import Access from "../../access/access";
import { ALL_PERMISSIONS } from "../../constants/permissions";
import { convertDate } from "../../utils/index";
import { DateTimeFormat } from "../../constants/index";

const WareHouses = () => {
    const navigate = useNavigate();
    const { globalDispatch } = useContext(GlobalContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const getWarehouse = async () => {
            try {
                const response = await apiClient.get(
                    endpoints.warehouse.list()
                );

                if (response?.data) {
                    setData(response.data); // Đồng bộ dữ liệu
                } else {
                    message.error("Dữ liệu kho hàng không hợp lệ hoặc rỗng");
                }
            } catch (error) {
                message.error("Không thể tải dữ liệu kho hàng");
            } finally {
                setLoading(false); // Đảm bảo luôn tắt loading
            }
        };

        getWarehouse();
    }, []);

    const handleAddCategories = () => {
        navigate("/warehouse/add", { replace: true });
    };

    const handleDeleteProducts = (id) => {
        processWithModals({
            modalName: ProcessModalName.ConfirmCustomContent,
            title: "Xác nhận",
            content: "Bạn chắc chắn muốn xóa kho hàng này?",
            onOk: () => removeCategory(id),
        });
    };

    const removeCategory = async (id) => {
        const data = await apiClient.delete(endpoints.warehouse.delete(id));
        if (data) {
            message.success("Xóa kho thành công!");
            const data1 = await apiClient.get(endpoints.warehouse.list());
            setData(data1.data);
        }
    };

    const getColumnsConfig = () => {
        const handleViewWareHouse = (item) => {
            globalDispatch({
                type: "breadcrum",
                data: item.name,
            });
            if (item?.id) {
                navigate(`/warehouse/${item.id}`); // Điều hướng đến trang chi tiết
            } else {
                console.error("Item không có id:", item);
            }
        };

        const handleEditWarehouse = (categoriesData) => {
            globalDispatch({
                type: "breadcrum",
                data: categoriesData.name,
            });
            navigate(`/warehouse/${categoriesData.id}/edit`, {
                replace: true,
            });
        };

        return [
            {
                title: "Tên kho",
                dataIndex: "name",
                key: "name",

                render: (value, item) => {
                    return (
                        <div className="flex items-center gap-4">
                            <span>
                                <span className="items-center justify-start p-0">
                                    {value}
                                </span>
                            </span>
                            {item?.isDefault && (
                                <span>
                                    <Tag color="blue">Địa chỉ mặc định</Tag>
                                </span>
                            )}
                        </div>
                    );
                },
                ellipsis: false,
                width: "40%",
            },
            {
                title: "Địa chỉ",
                dataIndex: "address",
                key: "address",
                render: (value) => {
                    return <span>{value}</span>;
                },
                ellipsis: false,
                width: "120px",
                responsive: ["sm"],
            },

            {
                title: "Ngày Tạo",
                dataIndex: "created_at",
                key: "created_at",
                render: (value, item) => {
                    return (
                        <div className="break-words">
                            {convertDate(
                                value,
                                DateTimeFormat.TIME_STAMP_POSTGRES_TZ,
                                DateTimeFormat.TimeStamp
                            )}
                        </div>
                    );
                },
                ellipsis: false,
                width: "120px",
                responsive: ["lg"],
            },

            // Action
            {
                title: "Thao tác",
                dataIndex: "action",
                key: "action",
                render: (_value, item) => {
                    return (
                        <div className="flex gap-x-4 ">
                            <Tooltip title="Xoá địa chỉ">
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        handleDeleteProducts(item.id)
                                    }
                                />
                            </Tooltip>
                            <Tooltip title="Cât nhật địa chỉ">
                                <Button
                                    variant="link"
                                    icon={<EditOutlined />}
                                    onClick={() => handleViewWareHouse(item)}
                                />
                            </Tooltip>
                        </div>
                    );
                },
                width: 60,
            },
        ];
    };

    return (
        <>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách kho"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <Access
                    permission={ALL_PERMISSIONS.WAREHOUSE.CREATE}
                    hideChildren
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddCategories}
                        size="large"
                        className="!rounded-none"
                    >
                        Tạo mới
                    </Button>
                </Access>
            </div>
            <div className="w-full my-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả kho",
                            children: (
                                <div className="w-full mt-2">
                                    <TableComponent
                                        loading={loading}
                                        filtersInput="filters"
                                        getColumnsConfig={getColumnsConfig}
                                        filterValue={null}
                                        loadData={() => {}}
                                        data={data}
                                        scroll={{ y: "200px" }}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default WareHouses;

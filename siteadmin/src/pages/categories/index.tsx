import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CategoriesTable from "../../components/categories/CategoriesTable";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";
import CustomizeTab from "../../components/common/CustomizeTab";
import CategoriesSearch from "src/components/categories/categoriesSearch";
const Categories = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const fetchCategories = async () => {
        try {
            const { data } = await apiClient.get(endpoints.categories.list);
            setData(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []); // Thêm [] để chỉ gọi 1 lần khi component mount
    const handleAddCategories = () => {
        navigate("/categories/add", { replace: true });
    };

    const handleEditCategories = (categoriesData) => {
        navigate(`/categories/${categoriesData.id}/edit`, {
            replace: true,
        });
    };

    const handleViewCategories = (categoriesData) => {
        navigate(`/categories/${categoriesData.id}`, { replace: true });
    };

    // const handleDeleteCategories = (id) => {
    //     processWithModals(ProcessModalName.ConfirmCustomContent)(
    //         "Xác nhận",
    //         "Bạn chắc chắn muốn xóa danh mục này?"
    //     )(() => removeCategory(id));
    // };

    // const removeCategory = async (id) => {
    //     try {
    //         console.log("Xóa danh mục với ID:", id);

    //         const response = await apiClient.delete(
    //             endpoints.categories
    //         );

    //         message.success(
    //             response.data.message || "Xóa danh mục thành công!"
    //         );

    //         fetchCategories(); // Cập nhật lại danh sách danh mục sau khi xóa
    //     } catch (error) {
    //         console.error("Lỗi khi xóa danh mục:", error);
    //         message.error("Không thể xóa danh mục. Vui lòng thử lại!");
    //     }
    // };

    return (
        <>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách danh mục"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <div className="flex justify-end items-center">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddCategories}
                        size="large"
                        className="!rounded-none"
                    >
                        Tạo mới
                    </Button>
                </div>
            </div>
            <div className="w-full my-6 flex flex-col gap-4 px-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả voucher",
                            children: (
                                <div className="w-full mt-2">
                                    <CategoriesSearch setFilters={() => {}} />
                                    <CategoriesTable
                                        handleEditCategories={
                                            handleEditCategories
                                        }
                                        handleViewCategories={
                                            handleViewCategories
                                        }
                                        // handleDeleteCategories={
                                        //     handleDeleteCategories
                                        // }
                                        data={data}
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

export default Categories;

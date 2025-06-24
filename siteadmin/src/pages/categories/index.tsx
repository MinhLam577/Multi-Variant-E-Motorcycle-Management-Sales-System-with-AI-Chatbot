import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CategoriesTable from "../../components/categories/CategoriesTable";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";
import CustomizeTab from "../../components/common/CustomizeTab";
import CategoriesSearch from "src/components/categories/categoriesSearch";
import Access from "src/access/access";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import { useStore } from "src/stores";
import {
    CategoryResponseTypeEnum,
    globalFilterCategoryType,
} from "src/stores/categories.store";
import { observer } from "mobx-react-lite";
import {
    processWithModals,
    ProcessModalName,
} from "../../containers/processWithModals.js";
import { getErrorMessage } from "src/utils";
const Categories = () => {
    const navigate = useNavigate();
    const store = useStore();
    const { categoriesObservable: categoriesStore } = store;
    const [globalFiltersCategories, setGlobalFiltersCategories] =
        useState<globalFilterCategoryType>({
            search: undefined,
            type: undefined,
            status: undefined,
            responseType: CategoryResponseTypeEnum.FLAT,
        });
    const fetchCategories = async (query?: object) => {
        try {
            await categoriesStore.getListCategories(query);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
        }
    };
    useEffect(() => {
        fetchCategories({
            ...categoriesStore.pagination,
            ...globalFiltersCategories,
        });
    }, []);

    useEffect(() => {
        fetchCategories({
            ...categoriesStore.pagination,
            ...globalFiltersCategories,
        });
    }, [categoriesStore.pagination, globalFiltersCategories]);
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

    const handleDeleteCategories = (id: string) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn xóa danh mục này?"
        )(() => removeCategory(id));
    };

    const removeCategory = async (id: string) => {
        try {
            const res = await categoriesStore.removeCategory(id);
            if (res) {
                message.success("Xóa danh mục thành công");
                fetchCategories({
                    ...categoriesStore.pagination,
                    ...globalFiltersCategories,
                });
            }
        } catch (error) {
            const errorMessage = getErrorMessage(
                error,
                "Xóa danh mục không thành công"
            );
            message.error(errorMessage);
        }
    };

    return (
        <>
            <Access permission={ALL_PERMISSIONS.CATEGORIES.GET_PAGINATE}>
                <div className="flex justify-between items-start md:items-center animate-slideDown flex-col gap-4 md:flew-row md:gap-0">
                    <AdminBreadCrumb
                        description="Thông tin danh sách danh mục"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />

                    <Access
                        permission={ALL_PERMISSIONS.CATEGORIES.CREATE}
                        hideChildren
                    >
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
                    </Access>
                </div>
                <div className="w-full my-6 flex flex-col gap-4 px-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                    <CustomizeTab
                        items={[
                            {
                                key: "1",
                                label: "Tất cả voucher",
                                children: (
                                    <div className="w-full mt-2">
                                        <CategoriesSearch
                                            setFilters={
                                                setGlobalFiltersCategories
                                            }
                                        />
                                        <CategoriesTable
                                            handleEditCategories={
                                                handleEditCategories
                                            }
                                            handleViewCategories={
                                                handleViewCategories
                                            }
                                            handleDeleteCategories={
                                                handleDeleteCategories
                                            }
                                            data={categoriesStore.data}
                                        />
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </Access>
        </>
    );
};

export default observer(Categories);

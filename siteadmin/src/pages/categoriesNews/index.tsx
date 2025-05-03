import { PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NewsSearch from "src/components/categories_blog/NewsSearch";
import NewsTable from "../../components/categories_blog/NewsTable";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import CustomizeTab from "src/components/common/CustomizeTab";

export interface GlobalFilterCategoriesNews {
    search: string | null;
}

const CategoriesNews = () => {
    const navigate = useNavigate();
    const [globalFilters, setGlobalFilters] = useState({ search: null });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchBlogNew = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(
                endpoints.blogcategories.list()
            );

            if (response?.data?.data) {
                setData(response.data.data);
            } else {
                message.error("Dữ liệu blog không hợp lệ hoặc rỗng");
            }
        } catch (error) {
            message.error("Lỗi khi tải danh sách blog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogNew();
    }, []);

    const handleAddNews = () => {
        navigate("/categorynews/add", { replace: true });
    };

    const handleEditNews = (newsData) => {
        navigate(`/categorynews/${newsData.id}/edit`, { replace: true });
    };

    const handleViewNews = (newsData) => {
        navigate(`/categorynews/${newsData.id}`, { replace: true });
    };

    return (
        <section className="w-full">
            <div
                className={`flex justify-between items-center animate-slideDown`}
            >
                <AdminBreadCrumb
                    description="Danh sách các danh mục tin tức"
                    items={getBreadcrumbItems(location.pathname)}
                />
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddNews}
                        size="large"
                        className="!rounded-none"
                    >
                        Tạo danh mục
                    </Button>
                </div>
            </div>
            <div className="w-full flex flex-col gap-4 bg-[var(--content-table-background-color)] rounded-md px-4 pb-4 my-6 animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả danh mục tin tức",
                            children: (
                                <div className="w-full flex flex-col gap-4">
                                    <NewsSearch setFilters={setGlobalFilters} />
                                    <NewsTable
                                        data={data}
                                        loading={loading}
                                        globalFilters={globalFilters}
                                        handleUpdateNews={handleEditNews}
                                        handleViewNews={handleViewNews}
                                        refreshData={fetchBlogNew}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </section>
    );
};

export default CategoriesNews;

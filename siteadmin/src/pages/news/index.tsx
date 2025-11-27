import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NewsTable from "../../components/news/NewsTable";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";
import NewsSearch from "../../components/categories_blog/NewsSearch";
import CustomizeTab from "../../components/common/CustomizeTab";
import Access from "../../access/access";
import { ALL_PERMISSIONS } from "../../constants/permissions";
import { filterEmptyFields } from "@/utils";

export interface GlobalFilterNewsType {
    search?: string;
    created_from?: string;
    created_to?: string;
    blog_category_id?: string;
    current?: number;
    pageSize?: number;
}

const News = () => {
    const navigate = useNavigate();
    const [globalFilters, setGlobalFilters] = useState<GlobalFilterNewsType>({
        search: undefined,
        created_from: undefined,
        created_to: undefined,
        blog_category_id: undefined,
        current: 1,
        pageSize: 10,
    });
    const [News, setNewsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id: blog_category_id } = useParams();
    useEffect(() => {
        if (!blog_category_id) return;
        setGlobalFilters((prev) => ({
            ...prev,
            blog_category_id: blog_category_id,
        }));
    }, [blog_category_id]);

    useEffect(() => {
        if (blog_category_id) {
            fetchData({
                ...globalFilters,
                blog_category_id: blog_category_id,
            });
        }
    }, [globalFilters]);

    const fetchData = async (query?: string | GlobalFilterNewsType) => {
        try {
            setLoading(true);
            const validateQuery = (
                query?: GlobalFilterNewsType | string
            ): string => {
                // Xử lý chuyển đổi query string thành object
                let parsedQuery: GlobalFilterNewsType = {
                    ...(typeof query === "string"
                        ? Object.fromEntries(new URLSearchParams(query.trim()))
                        : query),
                };

                // Gộp filters và xử lý dữ liệu
                const filters: GlobalFilterNewsType = filterEmptyFields({
                    ...globalFilters,
                    ...parsedQuery,
                    search: parsedQuery?.search?.trim(),
                });

                // Tạo query string
                const queryString = new URLSearchParams(
                    Object.fromEntries(
                        Object.entries(filters).map(([key, value]) => [
                            key,
                            String(value),
                        ])
                    )
                ).toString();
                return queryString;
            };
            const validateQueryString = validateQuery(query);
            const response = await apiClient.get(
                endpoints.blogs.list(validateQueryString)
            );

            if (response?.data?.data) {
                setNewsData(response.data.data);
            } else {
                message.error("Dữ liệu không hợp lệ hoặc rỗng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu blog:", error);
            message.error("Lấy dữ liệu thất bại");
        } finally {
            setLoading(false);
        }
    };
    const handleAddNews = () => {
        navigate(`/categorynews/${blog_category_id}/news/add`, {
            replace: true,
        });
    };

    const handleEditNews = (newsData) => {
        navigate(`/categorynews/${blog_category_id}/news/${newsData.id}/edit`, {
            replace: true,
        });
    };

    const handleViewNews = (newsData) => {
        navigate(`/categorynews/${blog_category_id}/news/${newsData.id}`, {
            replace: true,
        });
    };

    return (
        <>
            <div className="flex justify-between items-start animate-slideDown flex-col gap-4 md:flex-row md:gap-0 md:items-center">
                <AdminBreadCrumb
                    description="Thông tin chi tiết danh mục"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />

                <Access permission={ALL_PERMISSIONS.BLOGS.CREATE} hideChildren>
                    <div className="flex justify-end items-center">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddNews}
                            size="large"
                            className="!rounded-none"
                        >
                            Tạo mới
                        </Button>
                    </div>
                </Access>
            </div>

            <div className="w-full flex flex-col gap-4 bg-[var(--content-table-background-color)] rounded-md px-4 pb-4 my-6 animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: <h2>Tìm thấy {News.length} kết quả </h2>,
                            children: (
                                <>
                                    <NewsSearch setFilters={setGlobalFilters} />
                                    <NewsTable
                                        globalFilters={globalFilters}
                                        handleUpdateNews={handleEditNews}
                                        handleViewNews={handleViewNews}
                                        data={News}
                                        fetchData={fetchData}
                                        loading={loading}
                                    />
                                </>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default News;

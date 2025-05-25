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
import Access from "src/access/access";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import { paginationData } from "src/stores/voucher";
import { convertDate, filterEmptyFields } from "src/utils";
import { DateTimeFormat } from "src/constants";

export interface GlobalFilterCategoriesNews {
    search?: string;
    created_from?: string;
    created_to?: string;
}

const CategoriesNews = () => {
    const navigate = useNavigate();
    const [globalFilters, setGlobalFilters] =
        useState<GlobalFilterCategoriesNews>({
            search: undefined,
            created_from: undefined,
            created_to: undefined,
        });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchBlogNew = async (query?: GlobalFilterCategoriesNews) => {
        setLoading(true);
        try {
            const validateQuery = (
                query?: GlobalFilterCategoriesNews | string
            ): string => {
                // Xử lý chuyển đổi query string thành object
                let parsedQuery: GlobalFilterCategoriesNews & paginationData = {
                    ...(typeof query === "string"
                        ? Object.fromEntries(new URLSearchParams(query.trim()))
                        : query),
                    current: 1,
                    pageSize: 10,
                };

                // Gộp filters và xử lý dữ liệu
                const filters: paginationData & GlobalFilterCategoriesNews =
                    filterEmptyFields({
                        ...globalFilters,
                        ...parsedQuery,
                        created_from: parsedQuery?.created_from
                            ? convertDate(
                                  parsedQuery.created_from,
                                  DateTimeFormat.Date,
                                  DateTimeFormat.TIME_STAMP_POSTGRES
                              )
                            : undefined,
                        created_to: parsedQuery?.created_to
                            ? convertDate(
                                  parsedQuery.created_to,
                                  DateTimeFormat.Date,
                                  DateTimeFormat.TIME_STAMP_POSTGRES
                              )
                            : undefined,
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
                endpoints.blogcategories.list(validateQueryString)
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

    useEffect(() => {
        fetchBlogNew(globalFilters);
    }, [globalFilters]);

    return (
        <section className="w-full">
            <div
                className={`flex justify-between items-center animate-slideDown`}
            >
                <AdminBreadCrumb
                    description="Danh sách các danh mục tin tức"
                    items={getBreadcrumbItems(location.pathname)}
                />

                <Access
                    permission={ALL_PERMISSIONS.BLOGCATEGORY.CREATE}
                    hideChildren
                >
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={handleAddNews}
                            size="large"
                            className="!rounded-none"
                        >
                            Tạo mục tin tức
                        </Button>
                    </div>
                </Access>
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

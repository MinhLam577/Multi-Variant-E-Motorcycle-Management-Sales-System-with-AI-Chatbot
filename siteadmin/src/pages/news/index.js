import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NewsTable from "../../components/news/NewsTable";
import { GlobalContext } from "../../contexts/global";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";
import NewsSearch from "../../components/categories_blog/NewsSearch";
import CustomizeTab from "../../components/common/CustomizeTab";
const News = () => {
    const navigate = useNavigate();
    const [globalFilters, setGlobalFilters] = useState({ searchText: null });
    const { globalDispatch } = useContext(GlobalContext);
    const [News, setNewsData] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await apiClient.get(
                endpoints.blogcategories.details(id)
            );

            if (response?.data?.blogs) {
                setNewsData(response.data.blogs);
            } else {
                message.error("Dữ liệu không hợp lệ hoặc rỗng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu blog:", error);
            message.error("Lấy dữ liệu thất bại");
        }
    };
    const handleAddNews = () => {
        navigate(`/categorynews/${id}/news/add`, { replace: true });
    };

    const handleEditNews = (newsData) => {
        console.log(newsData);
        globalDispatch({
            type: "breadcrum",
            data: newsData.title,
        });
        navigate(`/categorynews/${id}/news/${newsData.id}/edit`, {
            replace: true,
        });
    };

    const handleViewNews = (newsData) => {
        globalDispatch({
            type: "breadcrum",
            data: newsData.title,
        });
        navigate(`/categorynews/${id}/news/${newsData.id}`, { replace: true });
    };

    return (
        <>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin chi tiết danh mục"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
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
                                        dataNews={News}
                                        fetchData={fetchData}
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

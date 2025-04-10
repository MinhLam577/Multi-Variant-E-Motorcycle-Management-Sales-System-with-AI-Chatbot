import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NewsSearch from "../../components/categories_blog/NewsSearch";
import NewsTable from "../../components/categories_blog/NewsTable";
import { GlobalContext } from "../../contexts/global";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

const CategoriesNews = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBlogNew = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(endpoints.blogcategories.list());
      console.log("Dữ liệu blog:", response);

      if (response?.data) {
        setData(response.data);
      } else {
        message.error("Dữ liệu blog không hợp lệ hoặc rỗng");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách blog");
    } finally {
      setLoading(false); // Đảm bảo tắt loading ngay cả khi lỗi xảy ra
    }
  };

  useEffect(() => {
    fetchBlogNew();
  }, []);

  const handleAddNews = () => {
    navigate("/categorynews/add", { replace: true });
  };

  const handleEditNews = (newsData) => {
    globalDispatch({
      type: "breadcrum",
      data: newsData.name,
    });
    navigate(`/categorynews/${newsData.id}/edit`, { replace: true });
  };

  const handleViewNews = (newsData) => {
    console.log(newsData);
    globalDispatch({
      type: "breadcrum",
      data: newsData.name,
    });
    navigate(`/categorynews/${newsData.id}`, { replace: true });
  };

  return (
    <>
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <NewsSearch setFilters={setGlobalFilters} />
        </Col>
        <Col span={24} className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNews}
          >
            Tạo mới
          </Button>
        </Col>
        <Col span={24}>
          <NewsTable
            data={data}
            loading={loading}
            globalFilters={globalFilters}
            handleUpdateNews={handleEditNews}
            handleViewNews={handleViewNews}
            refreshData={fetchBlogNew} // Truyền hàm này vào NewsTable
          />
        </Col>
      </Row>
    </>
  );
};

export default CategoriesNews;

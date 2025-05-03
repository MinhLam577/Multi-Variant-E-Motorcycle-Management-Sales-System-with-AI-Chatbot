import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import NewsSearch from "../../components/news/NewsSearch";
import NewsTable from "../../components/news/NewsTable";
import { GlobalContext } from "../../contexts/global";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import NewsDetail from "./NewsDetail";

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
      console.log("Dữ liệu blog:", response);

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
            globalFilters={globalFilters}
            handleUpdateNews={handleEditNews}
            handleViewNews={handleViewNews}
            dataNews={News}
            fetchData={fetchData}
          />
        </Col>
      </Row>
    </>
  );
};

export default News;

import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import NewsSearch from "../../components/news/NewsSearch";
import NewsTable from "../../components/news/NewsTable";
import { GlobalContext } from "../../contexts/global";

const News = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddNews = () => {
    navigate("/news/add", { replace: true });
  };

  const handleEditNews = (newsData) => {
    globalDispatch({
      type: "breadcrum",
      data: newsData.title,
    });
    navigate(`/news/${newsData.newsId}/edit`, { replace: true });
  };

  const handleViewNews = (newsData) => {
    globalDispatch({
      type: "breadcrum",
      data: newsData.title,
    });
    navigate(`/news/${newsData.newsId}`, { replace: true });
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
          />
        </Col>
      </Row>
    </>
  );
};

export default News;

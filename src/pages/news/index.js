import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { GlobalContext } from "../../contexts/global";
import NewsSearch from "../../businessComponents/news/NewsSearch";
import NewsTable from "../../businessComponents/news/NewsTable";

const News = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddNews = () => {
    navigate('/news/add', { replace: true });
  };

  const handleEditNews = (newsData) => {
    globalDispatch({
      type: 'breadcrum',
      data: newsData.title
    });
    navigate(`/news/${newsData.newsId}/edit`, { replace: true });
  };

  const handleViewNews = (newsData) => {
    globalDispatch({
      type: 'breadcrum',
      data: newsData.title
    });
    navigate(`/news/${newsData.newsId}`, { replace: true });
  };

  return (
    <>
      <NewsSearch setFilters={setGlobalFilters}/>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNews}>Tạo mới</Button>
      <NewsTable
        globalFilters={globalFilters}
        handleUpdateNews={handleEditNews}
        handleViewNews={handleViewNews}
      />
    </>
  );
};

export default News;
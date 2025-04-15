import { Button, message, Popconfirm } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat, Status } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { Link, useParams } from "react-router";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import { useEffect, useState } from "react";

const getColumnsConfig = ({ hanleDeleteNews, handleUpdateNews }) => {
  const { id } = useParams();
  return [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",

      render: (value, item) => {
        return (
          <Link to={`/categorynews/${id}/news/${item.id}`}>
            <img
              src={value}
              alt="thumbnail"
              className="w-16 h-16 object-cover rounded cursor-pointer"
            />
          </Link>
        );
      },
      width: 100,
    },
    {
      title: "Tiêu đề & Mô tả",
      key: "title_description",
      render: (_, item) => {
        return (
          <div>
            <div className="font-medium mb-2">{item.title}</div>
            <div
              className="text-gray-500 text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        );
      },
      ellipsis: true,
      width: "100%",
    },    
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_value, item) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa tin tức này"}
              description={"Bạn có chắc chắn muốn xóa tin tức này ?"}
              onConfirm={() => hanleDeleteNews(item.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>

            <EditTwoTone
              twoToneColor="#f57800"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // setOpenModalUpdate(true);
                // setDataUpdate(record);
                handleUpdateNews(item);
              }}
            />
          </>
        );
      },
      width: 140,
    },
  ];
};

const NewsTable = ({
  globalFilters,
  handleUpdateNews,
  handleViewNews,

  fetchData,
}) => {
  // Use fake newsList data
  const [data, setData] = useState([]);
  const loading = false;
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          endpoints.blogcategories.details(id)
        );
        console.log(response.data.blogs);
        setData(response.data.blogs); // nếu bạn muốn lưu vào state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]); // nhớ thêm `id` vào dependency array

  const handleDeleteNews = async (id) => {
    try {
      const response = await apiClient.delete(endpoints.blogs.delete(id));
      console.log("Xóa thành công:", response);
      message.success("Xóa thành công");
      fetchData();

      // Có thể cập nhật lại danh sách tin tức sau khi xóa thành công
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error);
      message.success("Xóa thất bại");
    }
  };

  const handleChange = () => {};

  return (
    <>
      <h2>Tìm thấy kết quả </h2>
      <TableComponent
        loading={loading}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        data={data}
        handleUpdateNews={handleUpdateNews}
        handleViewNews={handleViewNews}
        hanleDeleteNews={handleDeleteNews}
        onChange={handleChange}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }} // Đặt vị trí pagination ở giữa
        loadData={() => {}}
        showHeader={false} // Ẩn header
      />
    </>
  );
};

NewsTable.propTypes = {
  globalFilters: PropTypes.object,
  handleUpdateNews: PropTypes.func,
  handleViewNews: PropTypes.func,
  dataNews: PropTypes.array.isRequired,
  fetchData: PropTypes.func,
};

export default NewsTable;

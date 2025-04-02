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

// Fake newsList data
const newsList = [
  {
    id: 1,
    title: "Tin Mẫu 1",
    thumbnail:
      "http://res.cloudinary.com/dk6yblsoj/image/upload/v1743245569/user/frlwijhfjqdknz2poit0.jpg",
    description:
      "Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1 Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1 Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1 Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1  Đây là tóm tắt cho tin mẫu 1 ",
    created_at: "2022-01-01T00:00:00Z",
    status: Status.Active,
  },
  {
    id: 2,
    title: "Tin Mẫu 2",
    thumbnail:
      "http://res.cloudinary.com/dk6yblsoj/image/upload/v1743245569/user/frlwijhfjqdknz2poit0.jpg",
    description:
      "Đây là tóm tắt cho tin mẫu 2 Đây là tóm tắt cho tin mẫu 1 Đây là tóm tắt cho tin mẫu 1",
    created_at: "2022-01-02T00:00:00Z",
    status: Status.InActive,
  },
  // Add more news items as needed
];

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
            <div className="text-gray-500 text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis ">
              {item.description}
            </div>
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
  const data = { newsList };
  const loading = false;

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
      <h2>Tìm thấy {newsList.length} kết quả </h2>
      <TableComponent
        loading={loading}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        data={data.newsList}
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

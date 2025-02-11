import { Button } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat, Status } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";

// Fake newsList data
const newsList = [
  {
    newsId: 1,
    title: "Tin Mẫu 1",
    brief: "Đây là tóm tắt cho tin mẫu 1",
    created_at: "2022-01-01T00:00:00Z",
    status: Status.Active,
  },
  {
    newsId: 2,
    title: "Tin Mẫu 2",
    brief: "Đây là tóm tắt cho tin mẫu 2",
    created_at: "2022-01-02T00:00:00Z",
    status: Status.InActive,
  },
  // Add more news items as needed
];

const getColumnsConfig = ({
  handleUpdateNews,
  handleViewNews,
  hanleDeleteNews,
  hanleActivateNews,
  hanleDeactivateNews,
}) => {
  return [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value, item) => {
        return (
          <Button
            type="link"
            className="custom-antd-btn-ellipsis-content !p-0"
            onClick={() => handleViewNews(item)}
          >
            {value}
          </Button>
        );
      },
      ellipsis: true,
    },
    {
      title: "Tóm tắt",
      dataIndex: "brief",
      key: "brief",
      ellipsis: true,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) =>
        moment(created_at).format(DateTimeFormat.TimeStamp),
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_value, item) => {
        return <GroupActionButton item={item} />;
      },
      width: 140,
    },
  ];
};

const NewsTable = ({ globalFilters, handleUpdateNews, handleViewNews }) => {
  // Use fake newsList data
  const data = { newsList };
  const loading = false;

  const hanleDeleteNews = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa tin tức này?"
    )(() => {});
  };

  const hanleActivateNews = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn đăng tải tin tức này lên?"
    )(() => {});
  };

  const hanleDeactivateNews = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn gỡ bỏ tin tức này xuống?"
    )(() => {});
  };

  return (
    <>
      <TableComponent
        loading={loading}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        data={data?.newsList}
        handleUpdateNews={handleUpdateNews}
        handleViewNews={handleViewNews}
        hanleDeactivateNews={hanleDeactivateNews}
        hanleActivateNews={hanleActivateNews}
        hanleDeleteNews={hanleDeleteNews}
        loadData={() => {}}
      />
    </>
  );
};

NewsTable.propTypes = {
  globalFilters: PropTypes.object,
  handleUpdateNews: PropTypes.func,
  handleViewNews: PropTypes.func,
};

export default NewsTable;

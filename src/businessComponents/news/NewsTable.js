import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { DateTimeFormat, Status } from "../../constants";
import { ACTIVATE_NEWS, DEACTIVATE_NEWS, GET_NEWS_LIST, REMOVE_NEWS } from "../../graphql/news";
import * as moment from "moment";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import PropTypes from 'prop-types';
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({
  handleUpdateNews,
  handleViewNews,
  hanleDeleteNews,
  hanleActivateNews,
  hanleDeactivateNews
}) => {
  return [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => handleViewNews(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
    },
    {
      title: 'Tóm tắt',
      dataIndex: 'brief',
      key: 'brief',
      ellipsis: true,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => moment(created_at).format(DateTimeFormat.TimeStamp),
      sorter: true,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_value, item) => {
        return <>
          <EditOutlined className='ml-1' title="Chỉnh sửa" onClick={() => handleUpdateNews(item)} />
          {item?.status === Status.InActive &&
            <EyeOutlined className='ml-1' title="Đăng lên" onClick={() => hanleActivateNews(item.newsId)} />}
          {item?.status === Status.Active &&
            <EyeInvisibleOutlined className='ml-1' title="Gỡ xuống" onClick={() => hanleDeactivateNews(item.newsId)} />}
          <DeleteOutlined className='ml-1' title="Xóa" onClick={() => hanleDeleteNews(item.newsId)} />
        </>;
      },
      width: 100,
    },
  ];
}

const NewsTable = ({ globalFilters, handleUpdateNews, handleViewNews}) => {
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_NEWS_LIST, { fetchPolicy: 'no-cache' });
  const [removeNews] = useMutation(REMOVE_NEWS, {
    onCompleted: (res) => {
      if (res?.removeNews?.status) {
        refetch();
        message.success('Xóa tin tức thành công!');
      }
    },
  });
  const [activateNews] = useMutation(ACTIVATE_NEWS, {
    onCompleted: (res) => {
      if (res?.activateNews?.status) {
        refetch();
        message.success('Đăng tải tin tức thành công!');
      }
    },
  });
  const [deactivateNews] = useMutation(DEACTIVATE_NEWS, {
    onCompleted: (res) => {
      if (res?.deactivateNews?.status) {
        refetch();
        message.success('Gỡ bỏ tin tức thành công!');
      }
    },
  });

  const hanleDeleteNews = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn xóa tin tức này?'
    )(
      () => removeNews({ variables: { id } })
    );
  }

  const hanleActivateNews = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn đăng tải tin tức này lên?'
    )(
      () => activateNews({ variables: { id } })
    );
  }

  const hanleDeactivateNews = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn gỡ bỏ tin tức này xuống?'
    )(
      () => deactivateNews({ variables: { id } })
    );
  }

  return (
    <>
      <TableComponent
        loading={loading}
        filtersInput='filters'
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        loadData={loadData}
        data={data?.newsList}
        handleUpdateNews={handleUpdateNews}
        handleViewNews={handleViewNews}
        hanleDeactivateNews={hanleDeactivateNews}
        hanleActivateNews={hanleActivateNews}
        hanleDeleteNews={hanleDeleteNews}
      />
    </>
  );
};

NewsTable.propTypes = {
  globalFilters: PropTypes.object, 
  handleUpdateNews: PropTypes.func, 
  handleViewNews: PropTypes.func
};

export default NewsTable;
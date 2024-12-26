import { Button, message } from "antd";
import { DateTimeFormat } from "../../constants";
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CATEGORIES_LIST, REMOVE_CATEGORY } from "../../graphql/categories";
import moment from "moment";
import PropTypes from 'prop-types';
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({
  handleEditCategories,
  handleViewCategories,
  hanleDeleteCategories,
}) => {
  return [
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => handleViewCategories(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
    },
    {
      title: 'Số thứ tự',
      dataIndex: 'sequenceNo',
      key: 'sequenceNo',
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
          <EditOutlined className='ml-1' title="Chỉnh sửa" onClick={() => handleEditCategories(item)} />
          {item?.isActive === true ?
            <EyeOutlined className='ml-1' title="Hiển thị"/>
            :   <EyeInvisibleOutlined className='ml-1' title="Ẩn" />
          }
          <DeleteOutlined className='ml-1' title="Xóa" onClick={() => hanleDeleteCategories(item.categoryId)} />
        </>;
      },
      width: 100,
    },
  ];
}

const CategoriesTable = ({ handleEditCategories, handleViewCategories}) => {
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_CATEGORIES_LIST, { fetchPolicy: 'no-cache' });
  const [removeCategory] = useMutation(REMOVE_CATEGORY, {
    onCompleted: (res) => {
      if (res?.removeCategory?.status) {
        refetch();
        message.success('Xóa danh mục thành công!');
      }
    },
  });

  const hanleDeleteCategories = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn xóa danh mục này?'
    )(
      () => removeCategory({ variables: { id } })
    );
  }

  return (
    <>
      <TableComponent 
        loading={loading}
        filtersInput='filters'
        getColumnsConfig={getColumnsConfig}
        loadData={loadData}
        data={data?.admin_categories}
        filterValue={null}
        handleEditCategories={handleEditCategories}
        handleViewCategories={handleViewCategories}
        hanleDeleteCategories={hanleDeleteCategories}
      />
    </>
  );
};

CategoriesTable.propTypes = {
  handleEditCategories: PropTypes.func, 
  handleViewCategories: PropTypes.func
};

export default CategoriesTable;
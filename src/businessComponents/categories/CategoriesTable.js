import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { message } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../api/cars";
import { DateTimeFormat } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
import { REMOVE_CATEGORY } from "../../graphql/categories";

const getColumnsConfig = ({
  handleEditCategories,
  handleViewCategories,
  hanleDeleteCategories,
}) => {
  return [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (value) => {
        return <div>{value}</div>;
      },
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (value) => {
        return <div>{value}</div>;
      },
      ellipsis: true,
    },
    {
      title: "Số thứ tự",
      dataIndex: "sequenceNo",
      key: "sequenceNo",
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
        return (
          <>
            <EditOutlined
              className="ml-1"
              title="Chỉnh sửa"
              onClick={() => handleEditCategories(item)}
            />
            {item?.isActive === true ? (
              <EyeOutlined className="ml-1" title="Hiển thị" />
            ) : (
              <EyeInvisibleOutlined className="ml-1" title="Ẩn" />
            )}
            <DeleteOutlined
              className="ml-1"
              title="Xóa"
              onClick={() => hanleDeleteCategories(item.categoryId)}
            />
          </>
        );
      },
      width: 100,
    },
  ];
};

const CategoriesTable = ({ handleEditCategories, handleViewCategories }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setData(data);
    };
    getCategories();
  }, []);

  const [removeCategory] = useMutation(REMOVE_CATEGORY, {
    onCompleted: (res) => {
      if (res?.removeCategory?.status) {
        message.success("Xóa danh mục thành công!");
      }
    },
  });

  const handleDeleteCategories = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa danh mục này?"
    )(() => removeCategory({ variables: { id } }));
  };

  return (
    <>
      <TableComponent
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        loadData={() => {}}
        data={data}
        filterValue={null}
        handleEditCategories={handleEditCategories}
        handleViewCategories={handleViewCategories}
        handleDeleteCategories={handleDeleteCategories}
      />
    </>
  );
};

CategoriesTable.propTypes = {
  handleEditCategories: PropTypes.func,
  handleViewCategories: PropTypes.func,
};

export default CategoriesTable;

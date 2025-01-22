import moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat } from "../../constants";
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({ handleEditCategories, handleDeleteCategories }) => {
  return [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (value) => {
        return <span>{value}</span>;
      },
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (value) => {
        return <span>{value}</span>;
      },
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
          <GroupActionButton
            handleEditCategories={handleEditCategories}
            handleDeleteCategories={handleDeleteCategories}
            item={item}
          />
        );
      },
      width: 140,
    },
  ];
};

const CategoriesTable = ({
  handleEditCategories,
  handleViewCategories,
  handleDeleteCategories,
  data,
}) => {
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
  handleDeleteCategories: PropTypes.func,
  data: [],
};

export default CategoriesTable;

import moment from "moment";
import PropTypes from "prop-types";
import GroupActionButton from "../../components/GroupActionButton";
import { DateTimeFormat } from "../../constants";
import TableComponent from "../../containers/TableComponent";
import { Button } from "antd";

const getColumnsConfig = ({
    handleDeleteCategories,
    handleViewCategories,
    handleEditCategories,
}) => {
    return [
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            render: (value, item) => {
                return (
                    <Button
                        type="link"
                        onClick={() => handleViewCategories(item)}
                    >
                        {value}
                    </Button>
                );
            },
            ellipsis: true,
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            render: (value) => <span>{value}</span>,

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
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        hanleDelete={handleDeleteCategories}
                        handleUpdate={handleEditCategories}
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
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleDeleteCategories,
                        handleViewCategories,
                        handleEditCategories,
                    })
                }
                loadData={() => {}}
                data={data}
                filterValue={null}
                rowKey="id" // Đảm bảo mỗi hàng có một `id` duy nhất
                scroll={{ y: "200px" }}
            />
        </>
    );
};

CategoriesTable.propTypes = {
    handleEditCategories: PropTypes.func,
    handleViewCategories: PropTypes.func,
    handleDeleteCategories: PropTypes.func,
    data: PropTypes.array.isRequired,
};

export default CategoriesTable;

//  {
//     title: "Thời gian tạo",
//     dataIndex: "deletedAt",
//     key: "deletedAt",
//     render: (deletedAt) => moment(deletedAt).format(DateTimeFormat.TimeStamp),
//     sorter: true,
//     ellipsis: true,
//   },

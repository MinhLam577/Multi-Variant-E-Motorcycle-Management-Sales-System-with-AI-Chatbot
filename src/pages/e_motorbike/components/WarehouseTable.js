import { InputNumber } from "antd";
import PropTypes from "prop-types";
import TableComponent from "../../../containers/TableComponent";
const dataFake = [
  {
    warehouseName: "Kho Hàng Bình Dương",
    initialStock: 1500,
  },
  {
    warehouseName: "Kho Hàng HCM",
    initialStock: 1500,
  },
];
const WarehouseTable = ({ onChangeInitialStock }) => {
  const getColumnsConfig = ({ onChangeInitialStock }) => {
    return [
      // Car Brand
      {
        title: "Kho hàng",
        dataIndex: "warehouseName",
        key: "warehouseName",
        render: (value) => {
          return <span>{value}</span>;
        },
        ellipsis: false,
        width: "120px",
      },
      //initialStock
      {
        title: "Tồn đầu kỳ",
        dataIndex: "initialStock",
        key: "initialStock",
        render: (value, record) => {
          return (
            <InputNumber
              value={value}
              onChange={(val) =>
                onChangeInitialStock({ ...record, initialStock: val })
              }
            />
          );
        },
        ellipsis: false,
        width: "120px",
      },
    ];
  };
  return (
    <TableComponent
      getColumnsConfig={getColumnsConfig}
      loadData={() => {}}
      data={dataFake}
      onChangeInitialStock={onChangeInitialStock}
      pagination={false}
      footer={null}
    />
  );
};

WarehouseTable.propTypes = {
  onChangeInitialStock: PropTypes.func,
};

export default WarehouseTable;

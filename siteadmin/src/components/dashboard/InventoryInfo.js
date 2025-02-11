import { Table } from "antd";
const dataDemo = [
  { name: "Xe tải Toyota", inventory: 50 },
  { name: "Xe tải Honda", inventory: 40 },
  { name: "Xe tải Ford", inventory: 60 },
  { name: "Xe tải Volkswagen", inventory: 45 },
  { name: "Xe khách Toyota", inventory: 50 },
  { name: "Xe khách Honda", inventory: 40 },
  { name: "Xe khách Ford", inventory: 60 },
  { name: "Xe khách Volkswagen", inventory: 45 },
];
function InventoryInfo() {
  const dataSource = dataDemo.map((item, index) => ({
    key: index + 1,
    name: item.name,
    inventory: item.inventory,
  }));

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng tồn kho",
      dataIndex: "inventory",
      key: "inventory",
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
}

export default InventoryInfo;

import { useState } from "react";
import { Table } from "antd";

const dataDemo = [
  {
    name: "Toyota",
    sales: 1000,
    logo: "/logo192.png",
  },
  {
    name: "Honda",
    sales: 800,
    logo: "/logo192.png",
  },
  {
    name: "Ford",
    sales: 1200,
    logo: "/logo192.png",
  },
  {
    name: "Volkswagen",
    sales: 900,
    logo: "/logo192.png",
  },
  {
    name: "Tesla",
    sales: 1500,
    logo: "/logo192.png",
  },
];

function TopSellingCars() {
  const [topSellingCars] = useState(dataDemo);

  const dataSource = topSellingCars.map((car, index) => ({
    key: index + 1,
    name: car.name,
    sales: car.sales,
    logo: car.logo,
  }));

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng bán",
      dataIndex: "sales",
      key: "sales",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (text, record) => (
        <img
          src={text}
          alt={record.name}
          className="object-contain w-10 h-10"
        />
      ),
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
}

export default TopSellingCars;

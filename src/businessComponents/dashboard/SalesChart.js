import { Column } from "@ant-design/plots";
const dataDemo = [
  { name: "Tổng doanh thu", dateStr: "2022-01-01", number: 1000 },
  { name: "Tổng doanh thu", dateStr: "2022-01-02", number: 1200 },
  { name: "Tổng doanh thu", dateStr: "2022-01-03", number: 1500 },
  { name: "Tổng đơn", dateStr: "2022-01-01", number: 50 },
  { name: "Tổng đơn", dateStr: "2022-01-02", number: 60 },
  { name: "Tổng đơn", dateStr: "2022-01-03", number: 70 },
];

function SalesChart() {
  const config = {
    data: dataDemo,
    xField: "dateStr",
    yField: "number",
    colorField: "name",
    group: true,
    style: {
      inset: 5,
    },
  };
  return <Column {...config} />;
}

export default SalesChart;

const Overview = () => {
  const carData = [
    { label: "Hãng sản xuất", value: "Volvo" },
    { label: "Mẫu xe", value: "XC 90" },
    { label: "Màu sắc", value: "trắng" },
    { label: "Loại động cơ", value: "4x4" },
    { label: "Hộp số", value: "Tự động" },
    { label: "Tình trạng", value: "Đã sử dụng" },
    { label: "Năm sản xuất", value: "2021" },
    { label: "Số km đã đi", value: "280,000" },
    { label: "Loại nhiên liệu", value: "Dầu diesel" },
    { label: "Dung tích động cơ", value: "5.2L" },
    { label: "Số cửa", value: "5" },
    { label: "Số xi lanh", value: "10" },
    { label: "Số VIN", value: "2D456THA798700213GT21" },
  ];

  return (
    <ul className="list-group">
      {carData.map((item, index) => (
        <li
          className="list-group-item d-flex justify-content-between align-items-start"
          key={index}
        >
          <div className="me-auto">
            <div className="day">{item.label}</div>
          </div>
          <span className="schedule">{item.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default Overview;

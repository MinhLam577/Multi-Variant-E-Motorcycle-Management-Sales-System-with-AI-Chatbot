const OverviewMotor = () => {
  const carData = [
    { label: "Hãng sản xuất", value: "Vinfast" },
    { label: "Mẫu xe", value: "EcoRide" },
    { label: "Màu sắc", value: "Xanh lá" },
    { label: "Loại động cơ", value: "Động cơ điện" },
    { label: "Hộp số", value: "Không có" },
    { label: "Năm sản xuất", value: "2022" },
    { label: "Loại nhiên liệu", value: "Điện" },
    { label: "Dung tích động cơ", value: "20w" },
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

export default OverviewMotor;

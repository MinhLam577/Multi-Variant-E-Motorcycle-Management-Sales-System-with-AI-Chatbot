const Features = () => {
  const featureCategories = [
    {
      title: "Tiện ích",
      items: [
        "Ghế nóng",
        "Vô lăng nóng",
        "Hệ thống định vị",
        "Cửa hành lý điện",
      ],
    },
    {
      title: "Giải trí",
      items: ["Apple CarPlay/Android Auto", "Bluetooth", "HomeLink"],
    },
    {
      title: "Ngoại thất",
      items: ["Mâm đúc", "Nóc/gương trời"],
    },
    {
      title: "An toàn",
      items: [
        "Camera lùi",
        "Cảnh báo điểm mù",
        "Hỗ trợ phanh",
        "Đèn LED",
        "Kiểm soát ổn định",
      ],
    },
  ];

  return (
    <>
      <div className="col-lg-12">
        <h4 className="title">Tính năng</h4>
      </div>
      {featureCategories.map((category, index) => (
        <div className="row" key={index}>
          <div className="col-lg-6 col-xl-6">
            <h5 className="subtitle">{category.title}</h5>
          </div>
          <div className="col-lg-6 col-xl-5">
            <ul className="service_list">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
          {index < featureCategories.length - 1 && <hr />}
        </div>
      ))}
    </>
  );
};

export default Features;

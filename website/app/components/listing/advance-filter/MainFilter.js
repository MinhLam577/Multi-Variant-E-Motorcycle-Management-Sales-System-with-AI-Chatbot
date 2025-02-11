const MainFilter = () => {
  const filterOptions = [
    {
      label: "Điều kiện",
      values: ["Mới nhất", "Gần đây", "Bán chạy nhất", "Đánh giá cũ"],
    },
    {
      label: "Chọn hãng",
      values: ["Audi", "Bentley", "BMW", "Ford", "Honda", "Mercedes"],
    },
    {
      label: "Chọn mẫu",
      values: ["A3 Sportback", "A4", "A6", "Q5"],
    },
    {
      label: "Chọn loại",
      values: ["Convertible", "Coupe", "Hatchback", "Sedan", "SUV"],
    },
  ];

  return (
    <>
      {filterOptions.map((option, index) => (
        <div key={index} className="col-12 col-sm-4 col-lg-2">
          <div className="advance_search_style">
            <select className="form-select show-tick">
              <option>{option.label}</option>
              {option.values.map((value, valueIndex) => (
                <option key={valueIndex}>{value}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </>
  );
};

export default MainFilter;

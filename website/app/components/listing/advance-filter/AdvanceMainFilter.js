const filterOptions = [
  {
    label: "Năm",
    options: ["1967", "1990", "2000", "2002", "2005", "2010", "2015", "2020"],
    type: "select",
  },
  {
    label: "Loại nhiên liệu",
    options: ["Diesel", "Electric", "Hybrid", "Petrol"],
    type: "select",
  },
  {
    label: "Hộp số",
    options: ["Autometic", "Manual", "Semi-Autometic"],
    type: "select",
  },
  {
    label: "Số cửa",
    options: ["2 Cửa", "3 Cửa", "4 Cửa", "5 Cửa"],
    type: "select",
  },
  {
    label: "Màu nội thất",
    options: ["Đen", "Beige", "Nâu", "Đỏ"],
    type: "select",
  },
  {
    label: "Màu ngoại thất",
    options: ["Đen", "Beige", "Nâu", "Đỏ"],
    type: "select",
  },
  {
    label: "Số xi-lanh",
    options: ["4", "6", "8"],
    type: "select",
  },
  {
    label: "Trạng thái danh sách",
    options: ["Hoạt động", "Đang chờ", "Vô hiệu"],
    type: "select",
  },

  {
    label: "Số VIN",
    placeholder: "Số VIN",
    type: "input",
    inputType: "number",
  },
];

const AdvanceMainFilter = () => {
  return (
    <>
      {filterOptions.map((option, index) => (
        <div className="col-12 col-sm-4 col-lg-2" key={index}>
          <div className="advance_search_style">
            {option.type === "select" ? (
              <select className="form-select show-tick">
                <option>{option.label}</option>
                {option.options.map((opt, i) => (
                  <option key={i}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                className="form-control form_control"
                type={option.inputType}
                placeholder={option.placeholder}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default AdvanceMainFilter;

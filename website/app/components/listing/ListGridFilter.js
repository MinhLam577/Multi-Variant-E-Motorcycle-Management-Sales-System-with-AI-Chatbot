const ListGridFilter = ({ data }) => {
  const options = [
    "Ngày: Mới nhất trước",
    "Mới nhất",
    "Gần đây",
    "Bán chạy nhất",
    "Đánh giá cũ",
  ];

  const selectOptions = options.map((option, index) => (
    <option key={index}>{option}</option>
  ));

  return (
    <div className="listing_filter_row db-767">
      <div className="col-md-4">
        <div className="page_control_shorting left_area tac-sm mb30-767 mt15">
          <p>
            Chúng tôi tìm thấy{" "}
            <span className="heading-color fw600">{data.length}</span> Xe sẵn
            sàng cho bạn
          </p>
        </div>
      </div>
      <div className="col-md-8">
        <div className="page_control_shorting right_area text-end tac-xsd">
          <ul>
            <li className="list-inline-item short_by_text listone">
              Sắp xếp theo:
            </li>
            <li className="list-inline-item listwo">
              <select className="form-select show-tick">{selectOptions}</select>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListGridFilter;

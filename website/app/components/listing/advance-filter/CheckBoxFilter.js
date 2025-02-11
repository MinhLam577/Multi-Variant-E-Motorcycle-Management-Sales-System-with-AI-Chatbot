const CheckBoxFilter = () => {
  const checkboxes = [
    {
      id: "customCheck1",
      label: "Kiểm soát hành trình thích ứng (6,676)",
    },
    {
      id: "customCheck2",
      label: "Ghế mát (9,784)",
    },
    {
      id: "customCheck3",
      label: "Khởi động không cần chìa khóa (9,784)",
    },
    {
      id: "customCheck4",
      label: "Hệ thống định vị (9,784)",
    },
    {
      id: "customCheck5",
      label: "Khởi động từ xa (9,784)",
    },
  ];

  return (
    <div className="advance_search_style">
      <div className="ui_kit_checkbox text-start me-3">
        {checkboxes.slice(0, 3).map((checkbox) => (
          <div className="df mb20" key={checkbox.id}>
            <input
              type="checkbox"
              className="custom-control-input"
              id={checkbox.id}
            />
            <label className="custom-control-label" htmlFor={checkbox.id}>
              {checkbox.label}
            </label>
          </div>
        ))}
      </div>
      {/* End .ui_kit_checkbox */}

      <div className="ui_kit_checkbox text-start">
        {checkboxes.slice(3).map((checkbox) => (
          <div className="df mb20" key={checkbox.id}>
            <input
              type="checkbox"
              className="custom-control-input"
              id={checkbox.id}
            />
            <label className="custom-control-label" htmlFor={checkbox.id}>
              {checkbox.label}
            </label>
          </div>
        ))}
      </div>
      {/* End .ui_kit_checkbox */}
    </div>
  );
};

export default CheckBoxFilter;

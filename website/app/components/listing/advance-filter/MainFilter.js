"use client";

import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import { getAllCategory } from "@/src/api/categories";

const MainFilter = observer(({ handleFilterChange }) => {
  const store = useStore();
  const StoreBrand = store.brandObservable;
  const StoreCategory = store.categoryObservable;
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleConditionChange = (e) => {
    const value = e.target.value;
    setSelectedCondition(value);
    handleFilterChange({ condition: value }); // hoặc tuỳ xử lý
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    handleFilterChange({ brandID: value });
  };

  const handleDeleteAll = () => {};
  const conditionValues = [
    "Mới nhất",
    "Gần đây",
    "Bán chạy nhất",
    "Đánh giá cũ",
  ];
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    //fetchCategories();handleData
    handleData();
  }, []);
  const handleData = async () => {
    await StoreBrand.getListBrand({ page: 1, size: 10 });

    // Gọi và xử lý dữ liệu category
    const res = await getAllCategory();
    console.log(res);
    if (res?.data) {
      const converted = convertToTreeData(res.data.data);
      setTreeData(converted);
    }
  };
  const convertToTreeData = (data) => {
    return data.map((item) => ({
      title: item.name,
      value: item.id,
      children:
        item.children?.length > 0
          ? convertToTreeData(item.children)
          : undefined,
    }));
  };

  const [value, setValue] = useState();
  // lay ra id category
  const onChange = (newValue) => {
    setValue(newValue);
    handleFilterChange({ categoryID: newValue });
  };
  const onPopupScroll = (e) => {
    console.log("onPopupScroll", e);
  };
  return (
    <>
      {/* Điều kiện */}
      <div className="col-12 col-sm-4 col-lg-2">
        <div className="advance_search_style">
          <select
            className="form-select show-tick"
            value={selectedCondition}
            onChange={handleConditionChange}
          >
            <option value="" disabled hidden>
              Điều kiện
            </option>
            {conditionValues.map((value, i) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Thương hiệun */}
      <div className="col-12 col-sm-4 col-lg-2">
        <div className="advance_search_style">
          <select
            className="form-select show-tick"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <option value="" disabled hidden>
              Thương hiệu
            </option>
            {StoreBrand?.listBrand.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category  */}
      <div className="w-full sm:w-1/3 lg:w-1/6  mb-4">
        <div className="relative">
          <TreeSelect
            showSearch
            style={{ width: "100%", height: 48, color: "black" }} // color cho văn bản
            value={value}
            dropdownStyle={{ maxHeight: 700, overflow: "auto" }}
            placeholder="Danh mục"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
            onPopupScroll={onPopupScroll}
            className="w-full h-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
      </div>
    </>
  );
});

export default MainFilter;
// {
//   label: "Chọn mẫu",
//   values: ["A3 Sportback", "A4", "A6", "Q5"],
// },
// {
//   filterOptions.map((option, index) => (
//     <div key={index} className="col-12 col-sm-4 col-lg-2">
//       <div className="advance_search_style">
//         <select className="form-select show-tick">
//           <option>{option.label}</option>
//           {option.values.map((value, valueIndex) => (
//             <option key={valueIndex}>{value}</option>
//           ))}
//         </select>
//       </div>
//     </div>
//   ));
// }

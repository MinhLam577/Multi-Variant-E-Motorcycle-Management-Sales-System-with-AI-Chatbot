import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { toJS } from "mobx";
import PropTypes from "prop-types";
import ProductsSearch from "../../components/products/ProductsSearch";
import ProductsTable from "../../components/products/ProductsTable";

const EMotorbikeScreen = ({
  handleEditProducts,
  handleViewProducts,
  handleDeleteProducts,
  handleStatusProducts,
  handleAddProducts,
  data = [],
  filterValue,
  setFilterValue,
}) => {
  return (
    <>
      <div className="w-full">
        <ProductsSearch setFilters={setFilterValue} />
      </div>
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProducts}
        >
          Tạo mới
        </Button>
      </div>
      <div>
        <ProductsTable
          data={toJS(data)?.data ?? []}
          filterValue={filterValue}
          handleEditProducts={handleEditProducts}
          handleViewProducts={handleViewProducts}
          handleDeleteProducts={handleDeleteProducts}
          handleStatusProducts={handleStatusProducts}
          pagination={toJS(data)?.pagination}
        />
      </div>
    </>
  );
};

EMotorbikeScreen.propTypes = {
  data: PropTypes.array,
  filterValue: PropTypes.func,
  handleEditProducts: PropTypes.func,
  handleAddProducts: PropTypes.func,
  handleDeleteProducts: PropTypes.func,
  handleViewProducts: PropTypes.func,
  handleStatusProducts: PropTypes.func,
  setFilterValue: PropTypes.func,
};

export default EMotorbikeScreen;

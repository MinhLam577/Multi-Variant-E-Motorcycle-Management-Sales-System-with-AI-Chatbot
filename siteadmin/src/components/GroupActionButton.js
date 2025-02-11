import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";

const GroupActionButton = ({
  handleEditProducts,
  handleStatusProducts,
  handleDeleteProducts,
  item,
}) => {
  console.log("itemitem", item);
  return (
    <div className="flex gap-x-3 ">
      <Button
        onClick={() => handleEditProducts(item)}
        icon={<EditOutlined title="Chỉnh sửa" />}
        style={{ minWidth: "30px" }}
      />

      <Button
        icon={item.status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        title={item.status ? "Hiển thị" : "Ẩn"}
        onClick={() => handleStatusProducts(item, !item.status)}
        style={{ minWidth: "30px" }}
      />
      <Button
        icon={<DeleteOutlined />}
        title="Xóa"
        onClick={() => handleDeleteProducts(item.id)}
        style={{ minWidth: "30px" }}
      />
    </div>
  );
};

GroupActionButton.propTypes = {
  filterValue: PropTypes.object,
  handleEditProducts: PropTypes.func,
  handleViewProducts: PropTypes.func,
  handleDeleteProducts: PropTypes.func,
  handleStatusProducts: PropTypes.func,
  item: PropTypes.any,
};

export default GroupActionButton;

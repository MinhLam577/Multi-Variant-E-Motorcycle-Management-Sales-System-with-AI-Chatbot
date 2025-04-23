import {
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";

const GroupActionButton = ({
    handleStatusProducts,
    hanleDelete,
    handleUpdate,
    item,
}) => {
    return (
        <div className="flex gap-x-3 ">
            <Button
                onClick={() => handleUpdate(item)}
                icon={<EditOutlined title="Chỉnh sửa" />}
                style={{ minWidth: "30px" }}
            />

      <Button
        icon={<DeleteOutlined />}
        title="Xóa"
        onClick={() => hanleDelete(item.id)}
        style={{ minWidth: "30px" }}
      />
    </div>
  );
};

GroupActionButton.propTypes = {
    filterValue: PropTypes.object,
    handleUpdate: PropTypes.func,
    handleViewProducts: PropTypes.func,
    hanleDelete: PropTypes.func,
    handleStatusProducts: PropTypes.func,
    item: PropTypes.any,
};

export default GroupActionButton;
// <Button
//         icon={item.status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//         title={item.status ? "Hiển thị" : "Ẩn"}
//         onClick={() => handleStatusProducts(item, !item.status)}
//         style={{ minWidth: "30px" }}
//       />

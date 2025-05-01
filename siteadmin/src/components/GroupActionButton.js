import {
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";

const GroupActionButton = ({
    handleStatusProducts,
    handleUpdate,
    handleDelete,
    handleRestore,
    item,
}) => {
    return (
        <div className="flex gap-x-3 ">
            {handleUpdate && (
                <Button
                    onClick={() => handleUpdate(item)}
                    icon={<EditOutlined title="Chỉnh sửa" />}
                    style={{ minWidth: "30px" }}
                />
            )}

            <Button
                icon={<DeleteOutlined />}
                title="Xóa"
                onClick={() => handleDelete(item.id)}
                style={{ minWidth: "30px" }}
            />

            <Button
                icon={<UndoOutlined />}
                title="Phục hồi"
                onClick={() => handleRestore(item.id)}
                style={{ minWidth: "30px" }}
            />
        </div>
    );
};

GroupActionButton.propTypes = {
    filterValue: PropTypes.object,
    handleUpdate: PropTypes.func,
    handleViewProducts: PropTypes.func,
    handleDelete: PropTypes.func,
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

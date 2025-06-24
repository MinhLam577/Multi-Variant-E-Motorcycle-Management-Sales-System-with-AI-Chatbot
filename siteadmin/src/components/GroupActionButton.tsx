import {
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    UndoOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { observer } from "mobx-react-lite";
import Access from "src/access/access";
import { ALL_PERMISSIONS } from "src/constants/permissions";

export interface IGroupActionButtonProps {
    handleStatusProducts?: (item: any) => void;
    handleUpdate?: (item: any) => void;
    handleDelete?: (id: string | number) => void;
    handleRestore?: (id: string | number) => void;
    handleHardDelete?: (id: string | number) => void;
    moduleName?: string;
    item?: any;
}

const GroupActionButton: React.FC<IGroupActionButtonProps> = ({
    handleStatusProducts,
    handleUpdate,
    handleDelete,
    handleRestore,
    handleHardDelete,
    moduleName,
    item,
}) => {
    return (
        <div className="flex gap-x-3 ">
            {handleUpdate && (
                <Access
                    permission={ALL_PERMISSIONS?.[`${moduleName}`]?.UPDATE}
                    hideChildren={true}
                >
                    <Button
                        onClick={() => handleUpdate(item)}
                        icon={<EditOutlined title="Chỉnh sửa" />}
                        style={{ minWidth: "30px" }}
                    />
                </Access>
            )}

            {handleDelete && (
                <Access
                    permission={ALL_PERMISSIONS?.[`${moduleName}`]?.DELETE}
                    hideChildren={true}
                >
                    <Button
                        icon={<DeleteOutlined />}
                        title="Xóa"
                        onClick={() => handleDelete(item.id)}
                        style={{ minWidth: "30px" }}
                    />
                </Access>
            )}

            {handleRestore && (
                <Button
                    icon={<UndoOutlined />}
                    title="Phục hồi"
                    onClick={() => handleRestore(item.id)}
                    style={{ minWidth: "30px" }}
                />
            )}

            {handleHardDelete && (
                <Access
                    permission={ALL_PERMISSIONS?.[`${moduleName}`]?.HARD_DELETE}
                    hideChildren={true}
                >
                    <Button
                        onClick={() => handleHardDelete(item.id)}
                        icon={<CloseCircleOutlined title="Xóa vĩnh viễn" />}
                        style={{ minWidth: "30px" }}
                    />
                </Access>
            )}
        </div>
    );
};

export default observer(GroupActionButton);

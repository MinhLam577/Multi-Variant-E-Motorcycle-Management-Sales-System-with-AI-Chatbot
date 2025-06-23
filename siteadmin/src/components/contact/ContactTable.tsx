import { observer } from "mobx-react-lite";
import TableComponent from "src/containers/TableComponent";
import { useStore } from "src/stores";

import { Grid } from "antd";
import { ContactResponseType } from "src/stores/contact.store";
import { title } from "process";
import Access from "src/access/access";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
const { useBreakpoint } = Grid;
import {
    ProcessModalName,
    processWithModals,
} from "src/containers/processWithModals";
import { ALL_PERMISSIONS } from "src/constants/permissions";
interface ContactTableProps {
    data: ContactResponseType[];
    handleUpdateContact?: (item: ContactResponseType) => void;
    handleDeleteContact?: (id: string) => void;
}

const ContactTable: React.FC<ContactTableProps> = ({
    data,
    handleUpdateContact,
    handleDeleteContact,
}) => {
    const store = useStore();
    const screen = useBreakpoint();
    const contactObservable = store.contactObservable;
    const getColumnsConfig = ({
        handleUpdate,
        handleDelete,
    }: {
        handleUpdate: (item: ContactResponseType) => void;
        handleDelete: (id: string) => void;
    }) => {
        return [
            {
                title: "Tên",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Số điện thoại",
                dataIndex: "phone",
                key: "phone",
                responsive: ["md"],
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                responsive: ["md"],
            },
            {
                title: "Ghi chú",
                dataIndex: "note",
                key: "note",
                ellipsis: true,
                render: (text: string) => (
                    <span className="whitespace-pre-wrap">{text || "N/A"}</span>
                ),
                responsive: ["xl"],
            },
            {
                title: "Dịch vụ",
                dataIndex: "service",
                key: "service",
                responsive: ["sm"],
            },
            {
                title: "Action",
                render: (text, record, index) => {
                    return (
                        <>
                            <Access
                                permission={ALL_PERMISSIONS.CONTACT.DELETE}
                                hideChildren={true}
                            >
                                <span
                                    style={{
                                        cursor: "pointer",
                                        margin: "0 20px",
                                    }}
                                >
                                    <DeleteTwoTone
                                        twoToneColor="#ff4d4f"
                                        onClick={() =>
                                            processWithModals(
                                                ProcessModalName.ConfirmCustomContent
                                            )(
                                                "Xác nhận",
                                                `Bạn có chắc chắn muốn xóa user #${record.id} không?`
                                            )(() => {
                                                if (handleDeleteContact)
                                                    handleDeleteContact(
                                                        record.id
                                                    );
                                            })
                                        }
                                    />
                                </span>
                            </Access>
                            <Access
                                permission={ALL_PERMISSIONS.CONTACT.UPDATE}
                                hideChildren={true}
                            >
                                <EditTwoTone
                                    twoToneColor="#f57800"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        handleUpdateContact(record);
                                    }}
                                />
                            </Access>
                        </>
                    );
                },
            },
        ];
    };
    return (
        <>
            <TableComponent
                loading={contactObservable.loading}
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleUpdate: handleUpdateContact,
                        handleDelete: handleDeleteContact,
                    })
                }
                loadData={() => {}}
                observableName={contactObservable.constructor.name}
                data={data || []}
                rowKey={(item: ContactResponseType) => item.id}
                scroll={{ y: "200px" }}
            />
        </>
    );
};
export default observer(ContactTable);

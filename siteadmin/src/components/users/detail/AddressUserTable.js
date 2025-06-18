import { message, notification, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AntdTableLocale } from "../../../constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../../containers/processWithModals";
import apiClient from "../../../api/apiClient";
import endpoints from "../../../api/endpoints.ts";
import GroupActionButton from "../../GroupActionButton";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import UserModalUpdate from "../UserModalUpdate";
import { Button } from "antd";
import AddressModalCreate from "../../customers/AddressModalCreate";
import AddressModalUpdate from "../../customers/AddressModalUpdate";

const getColumnsConfig = ({
    hanleDeleteAddress,
    setOpenAddressModalUpdate,
    setDataUpdate,
    setAddressDataUpdate,
}) => {
    return [
        {
            title: "No",
            key: "index",
            render: (_value, _item, index) => index + 1,
            width: 80,
        },
        {
            title: "Số nhà",
            dataIndex: "street",
            key: "street",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Phường/xã",
            dataIndex: "ward",
            key: "ward",
            ellipsis: true,
            width: 100,
        },
        {
            title: "Quận/huyện",
            dataIndex: "district",
            key: "district",
            ellipsis: true,
            width: 100,
        },
        {
            title: "Tỉnh/TP",
            dataIndex: "province",
            key: "province",
            ellipsis: true,
            width: 100,
        },
        {
            title: "Người nhận",
            dataIndex: "receiver_name",
            key: "receiver_name",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Số ĐT người nhận",
            dataIndex: "receiver_phone",
            key: "receiver_phone",
            ellipsis: true,
            width: 140,
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (text, record) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => hanleDeleteAddress(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span
                                style={{ cursor: "pointer", margin: "0 20px" }}
                            >
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>

                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenAddressModalUpdate(true);
                                setAddressDataUpdate(record);
                            }}
                        />
                    </>
                );
            },
            width: 140,
        },
    ];
};

const AddressUserTable = () => {
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [openAddressModalUpdate, setOpenAddressModalUpdate] = useState(false);
    const [dataAddressUpdate, setAddressDataUpdate] = useState(null);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [dataCreate, setDataCreate] = useState(null);

    const { id } = useParams();
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);
    const fetchUser = async () => {
        try {
            const data = await apiClient.get(endpoints.customers.details(id));
            setUserInfo(data.data.receive_address);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin user:", error);
        }
    };
    const [loading] = useState(false);
    const hanleDeleteAddress = async (id) => {
        const data = await apiClient.delete(
            endpoints.receive_address.delete(id)
        );
        if (data && data.data) {
            message.success("Xóa địa chỉ thành công");
            setOpenModalCreate(false);
            await fetchUser();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
            });
        }
    };

    return (
        <>
            <div className="w-full flex items-end justify-end min-h-[50px] mb-3">
                <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                    Tạo mới
                </Button>
            </div>

            <Table
                locale={{
                    ...AntdTableLocale,
                }}
                className="table-fixed"
                columns={getColumnsConfig({
                    hanleDeleteAddress,
                    setOpenModalUpdate,
                    setAddressDataUpdate,
                    setOpenAddressModalUpdate,
                })}
                loading={loading}
                key={0}
                dataSource={userInfo}
                rowKey={"categoryId"}
                scroll={{ x: 400 }}
            />

            <AddressModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            />

            <AddressModalUpdate
                openAddressModalUpdate={openAddressModalUpdate}
                setOpenModalUpdate={setOpenAddressModalUpdate}
                dataAddressUpdate={dataAddressUpdate}
                setAddressDataUpdate={setAddressDataUpdate}
                fetchUser={fetchUser}
            />
        </>
    );
};

export default AddressUserTable;

import { Table } from "antd";
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

const getColumnsConfig = ({ hanleDeleteAddress }) => {
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
            dataIndex: "receiverName",
            key: "receiverName",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Số ĐT người nhận",
            dataIndex: "receiverPhone",
            key: "receiverPhone",
            ellipsis: true,
            width: 140,
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        hanleDeleteNews={hanleDeleteAddress}
                        item={item}
                    />
                );
            },
            width: 140,
        },
    ];
};

const AddressUserTable = () => {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiClient.get(
                    endpoints.customers.details(id)
                );
                console.log(data.data);
                setUserInfo(data.data.receive_address);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);
    const [loading] = useState(false);
    const hanleDeleteAddress = async (id) => {
        processWithModals(ProcessModalName.ConfirmCustomContent)(
            "Xác nhận",
            "Bạn chắc chắn muốn xóa địa chỉ này?"
        )(() => {});
    };

    return (
        <>
            <Table
                locale={{
                    ...AntdTableLocale,
                }}
                className="table-fixed"
                columns={getColumnsConfig({
                    hanleDeleteAddress,
                })}
                loading={loading}
                key={0}
                dataSource={userInfo}
                rowKey={"categoryId"}
                scroll={{ x: 400 }}
            />
        </>
    );
};

export default AddressUserTable;

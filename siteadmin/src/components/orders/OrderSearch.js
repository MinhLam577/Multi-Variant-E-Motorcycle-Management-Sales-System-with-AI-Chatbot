import { useContext, useState } from "react";

import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Select } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { EnumOrderStatuses, UserRoleConstant } from "../../constants";
import { GlobalContext } from "../../contexts/global";

const { RangePicker } = DatePicker;

const OrderSearch = ({ showStatus, setFilters }) => {
    const [form] = Form.useForm();
    const { user } = useContext(GlobalContext);
    const [sales, setSales] = useState([]);

    const onFinish = (values) => {
        var obj = {};
        obj["searchText"] = values?.searchText;

        if (values?.status) {
            obj["status"] = [values.status];
        }
        if (values?.date) {
            obj["fromDate"] = moment(values?.date[0].toDate())
                .hours(0)
                .minutes(0)
                .seconds(1)
                .toDate();
            obj["toDate"] = moment(values?.date[1].toDate())
                .hours(23)
                .minutes(59)
                .seconds(59)
                .toDate();
        }
        if (values?.orderNos) {
            obj["orderNos"] = values.orderNos;
        }
        if (values?.saleId) {
            obj["salesId"] = values?.saleId;
        }

        setFilters(obj);
    };

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ flex: "30%" }}
                labelWrap
                layout="vertical"
                className="flex flex-col gap-2 justify-between items-center"
            >
                <div className="flex justify-between w-full">
                    <Form.Item
                        label={<span className="font-bold">Mã đơn hàng</span>}
                        name="orderNos"
                        className="w-48"
                    >
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            options={[]?.map((i) => ({
                                value: i.orderNo,
                                label: i.orderNo,
                            }))}
                            placeholder="Chọn mã đơn hàng"
                            mode="multiple"
                            className="w-96"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-bold">Mã khách hàng</span>}
                        name="customer_id"
                        className="w-48"
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn mã khách hàng"
                            optionFilterProp="label"
                            mode="multiple"
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <div className="font-bold">Trạng thái đơn hàng</div>
                        }
                        name="status"
                        className="w-48"
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn trạng thái đơn"
                            optionFilterProp="label"
                            options={[]?.map((i) => ({
                                value: i.value,
                                label: EnumOrderStatuses[i.text],
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <div className="font-bold">
                                Trạng thái thanh toán
                            </div>
                        }
                        name="status"
                        className="w-48"
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn trạng thái thanh toán"
                            optionFilterProp="label"
                            options={[]?.map((i) => ({
                                value: i.value,
                                label: EnumOrderStatuses[i.text],
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <div className="font-bold">
                                Khoảng thời gian(day)
                            </div>
                        }
                        name="date"
                        className="w-60"
                    >
                        <RangePicker
                            format={"DD/MM/YYYY"}
                            placeholder={["Start Day", "End Day"]}
                        />
                    </Form.Item>
                </div>
                <div className="flex justify-between w-full items-center">
                    <div className="flex gap-2 items-center">
                        <Button
                            type="primary"
                            danger
                            htmlType="reset"
                            onClick={() => setFilters({ searchText: null })}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                    <Button type="primary">Xuất hóa đơn</Button>
                </div>
            </Form>
        </>
    );
};

OrderSearch.propTypes = {
    showStatus: PropTypes.bool,
    setFilters: PropTypes.func,
};

export default OrderSearch;

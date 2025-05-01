import { Col, DatePicker, Form, Input, Row, Select, Tooltip } from "antd";
import PropTypes from "prop-types";
import { PaymentStatus } from "../../constants";
import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";

// Khai báo store nhỏ cho trạng thái focus
const statusSearch = makeAutoObservable({
    isInputFocused: false,
    isInputHover: false,

    setInputFocused(focused) {
        this.isInputFocused = focused;
    },
    setInputHover(hover) {
        this.isInputHover = hover;
    },
});
const { RangePicker } = DatePicker;
const OrderSearch = ({
    globalFilters,
    setGlobalFilters,
    order_status,
    payment_status,
    payment_method,
    order_store,
    load_data,
}) => {
    const [form] = Form.useForm();

    const onFinish = async () => {
        load_data(globalFilters);
    };

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                labelWrap
                layout="vertical"
                className="flex flex-col"
                labelCol={{ flex: "30%" }}
            >
                <Row gutter={16} align="middle" justify={"space-between"}>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label={<span className="font-bold">Search</span>}
                            name="search"
                        >
                            <Tooltip
                                title={
                                    <span className="text-xs text-gray-400 font-semibold">
                                        Nhập mã đơn hàng, tên khách hàng, mã
                                        khách hàng, email
                                    </span>
                                }
                                placement="topLeft"
                                arrow={true}
                                color="#000"
                                trigger={"hover"}
                                open={
                                    statusSearch.isInputFocused &&
                                    statusSearch.isInputHover
                                }
                            >
                                <Input
                                    name="search"
                                    placeholder="Nhập mã đơn hàng, ..."
                                    value={globalFilters?.search || ""}
                                    onChange={(e) => {
                                        setGlobalFilters({
                                            search: e.target.value,
                                        });
                                    }}
                                    onFocus={() => {
                                        statusSearch.setInputFocused(true);
                                    }}
                                    onBlur={() => {
                                        statusSearch.setInputFocused(false);
                                    }}
                                    onMouseEnter={() => {
                                        statusSearch.setInputHover(true);
                                    }}
                                    onMouseLeave={() => {
                                        statusSearch.setInputHover(false);
                                    }}
                                />
                            </Tooltip>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Phương thức thanh toán
                                </div>
                            }
                            name="payment_method"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Chọn phương thức thanh toán"
                                optionFilterProp="label"
                                value={globalFilters?.payment_method}
                                options={payment_method?.map((i) => ({
                                    value: i,
                                    label: i,
                                }))}
                                onChange={(value) => {
                                    setGlobalFilters({ payment_method: value });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Trạng thái thanh toán
                                </div>
                            }
                            name="payment_status"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Chọn trạng thái thanh toán"
                                optionFilterProp="label"
                                value={globalFilters?.payment_status}
                                options={payment_status?.map((i) => ({
                                    value: i.key,
                                    label: PaymentStatus[i.key],
                                }))}
                                onChange={(value) => {
                                    setGlobalFilters({ payment_status: value });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Khoảng thời gian
                                </div>
                            }
                            name="date"
                        >
                            <RangePicker
                                format={"DD/MM/YYYY"}
                                placeholder={["Start Day", "End Day"]}
                                onChange={(_, dateString) => {
                                    setGlobalFilters({
                                        created_from: dateString[0],
                                        created_to: dateString[1],
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

OrderSearch.propTypes = {
    showStatus: PropTypes.bool,
    order_status: PropTypes.array,
    globalFilters: PropTypes.object,
    setGlobalFilters: PropTypes.func,
    set_order_status: PropTypes.func,
    payment_status: PropTypes.array,
    set_payment_status: PropTypes.func,
    payment_method: PropTypes.array,
    set_payment_method: PropTypes.func,
    order_store: PropTypes.object,
    load_data: PropTypes.func,
};

export default observer(OrderSearch);

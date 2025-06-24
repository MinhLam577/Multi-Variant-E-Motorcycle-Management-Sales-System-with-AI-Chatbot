import { Col, DatePicker, Form, Input, Row, Select, Tooltip } from "antd";
import { PaymentStatus } from "../../constants";
import { observer } from "mobx-react-lite";
import { makeAutoObservable, toJS } from "mobx";
import { DeliveryMethodResponseType } from "src/stores/paymentMethod";
import { useCallback } from "react";
import { debounce } from "lodash";
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
    payment_status,
    payment_method,
    delivery_method,
}) => {
    const [form] = Form.useForm();
    const debounceInputChange: (value: string) => void = useCallback(
        debounce((value: string) => {
            setGlobalFilters({
                search: value,
            });
        }, 400),
        []
    );
    return (
        <>
            <Form
                form={form}
                labelWrap
                layout="vertical"
                className="flex flex-col"
                labelCol={{ flex: "30%" }}
            >
                <Row gutter={8} align="middle">
                    <Col xs={24} sm={24} md={24} lg={18} xl={18}>
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
                                    onChange={(e) => {
                                        debounceInputChange(e.target.value);
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
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
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
                                className="w-full"
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
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
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
                                placeholder="Phương thức thanh toán"
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
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Phương thức vận chuyển
                                </div>
                            }
                            name="delivery_method"
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder="Phương thức vận chuyển"
                                optionFilterProp="label"
                                value={globalFilters?.delivery_method}
                                options={delivery_method?.map(
                                    (i: DeliveryMethodResponseType) => ({
                                        value: i.id,
                                        label: i.name,
                                    })
                                )}
                                onChange={(value) => {
                                    setGlobalFilters({
                                        delivery_method: value,
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
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
                                placeholder="Trạng thái thanh toán"
                                optionFilterProp="label"
                                value={globalFilters?.payment_status}
                                options={payment_status?.map((i) => ({
                                    value: i.value,
                                    label: PaymentStatus[i.key],
                                }))}
                                onChange={(value) => {
                                    setGlobalFilters({ payment_status: value });
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};
export default observer(OrderSearch);

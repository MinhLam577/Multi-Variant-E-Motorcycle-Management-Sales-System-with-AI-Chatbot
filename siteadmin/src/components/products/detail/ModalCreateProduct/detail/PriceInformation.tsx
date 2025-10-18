import { Col, Form, Input, Row } from "antd";
import { observer } from "mobx-react-lite";
import { modalCreateProductStore } from "../ModalCreateProduct.store";
import { FormInstance } from "antd/lib";
import { debounceHandleUpdateProductValue } from "../ModalCreateProduct";
interface IPriceInformation {
    form: FormInstance;
}

const PriceInformation = observer(({ form }: IPriceInformation) => {
    return (
        <div className="flex flex-col gap-4 bg-white rounded-md p-4">
            <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                Thông tin giá
            </h2>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                        label="Giá bán"
                        name={"price_sold"}
                        tooltip="Số tiền khách hàng cần thanh toán"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!modalCreateProductStore.hasSkus) {
                                        const convertNumber = Number(value);
                                        if (
                                            isNaN(convertNumber) ||
                                            convertNumber < 0
                                        ) {
                                            return Promise.reject(
                                                new Error(
                                                    "Vui lòng nhập giá bán hợp lệ"
                                                )
                                            );
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập giá bán"
                            className="w-full h-10"
                            autoComplete="off"
                            onChange={(e) => {
                                const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                                form.setFieldValue("price_sold", value);
                                debounceHandleUpdateProductValue(
                                    "price_sold",
                                    value
                                );
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                        label="Giá so sánh"
                        name={"price_compare"}
                        tooltip="Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho khách hàng"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!modalCreateProductStore.hasSkus) {
                                        const convertNumber = Number(value);
                                        if (
                                            isNaN(convertNumber) ||
                                            convertNumber < 0
                                        ) {
                                            return Promise.reject(
                                                new Error(
                                                    "Vui lòng nhập giá so sánh hợp lệ"
                                                )
                                            );
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập giá so sánh"
                            className="w-full h-10"
                            autoComplete="off"
                            onChange={(e) => {
                                const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                                form.setFieldValue("price_compare", value);
                                debounceHandleUpdateProductValue(
                                    "price_compare",
                                    value
                                );
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
});

export default PriceInformation;

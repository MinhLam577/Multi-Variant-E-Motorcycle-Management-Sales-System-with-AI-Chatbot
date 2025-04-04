import {
    CloseOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    message,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import RichTextEditor from "../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, {
    UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";

export const ProductsDetailMode = {
    View: 1,
    Add: 2,
    Edit: 3,
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
    },
};

const ProductsDetail = ({ mode }) => {
    const { id } = useParams();
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [settingData, setData] = useState({
        categories: [],
        colors: [],
        branches: [],
    });

    console.log("settingData", settingData);

    const [loading, setLoading] = useState(false);

    useEffect(() => {}, []);

    const getCardTitle = () => {
        if (mode === ProductsDetailMode.View) {
            return "Chi tiết sản phẩm";
        } else if (mode === ProductsDetailMode.Add) {
            return "Tạo sản phẩm";
        } else if (mode === ProductsDetailMode.Edit) {
            return "Chỉnh sửa sản phẩm";
        }
    };

    const getButtonOkText = () => {
        if (mode === ProductsDetailMode.Add) {
            return (
                <>
                    <PlusOutlined />
                    &nbsp;Tạo
                </>
            );
        } else if (mode === ProductsDetailMode.Edit) {
            return (
                <>
                    <SaveOutlined />
                    &nbsp;Lưu
                </>
            );
        }
    };

    const getButtonCancelText = () => {
        if (mode === ProductsDetailMode.Add) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === ProductsDetailMode.Edit) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === ProductsDetailMode.View) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Đóng
                </>
            );
        }
    };

    const getButtonEditText = () => {
        if (mode === ProductsDetailMode.View) {
            return (
                <>
                    <EditOutlined />
                    &nbsp;Sửa
                </>
            );
        }
    };

    const isReadOnly = () => {
        if (mode === ProductsDetailMode.Add) {
            return false;
        } else if (mode === ProductsDetailMode.Edit) {
            return false;
        }
        return true;
    };

    const handleOk = () => {
        if (mode === ProductsDetailMode.Add) {
            form.submit();
        } else if (mode === ProductsDetailMode.Edit) {
            form.submit();
        }
    };

    const handleCancel = () => {
        if (mode === ProductsDetailMode.Edit) {
            processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
                navigate(`/products`);
            });
        } else {
            navigate("/products");
        }
    };

    const handleEdit = () => {
        if (mode === ProductsDetailMode.View) {
            navigate(`/products/${id}/edit`, { replace: true });
        }
    };

    const handleFormFinish = async (values) => {
        const dto = {
            ...values,
        };

        const formData = {
            ...values,
            category_id: dto?.category_id,
            brand_id: dto?.brand_id.toString(),
            stock: parseInt(dto?.stock ?? 0),
            images: fileList?.map((i) => ({
                url: i?.url,
                color: "",
                count: "",
            })),
            modelYear: 0,
            fuelType: "",
            transmission: "",
            videos: [],
            videosCount: 0,
            rating: 0,
            reviewsCount: 0,
            mileage: 0,
            totalWindown: 0,
            totalXilanh: 0,
            status: true,
        };

        if (mode === ProductsDetailMode.Add) {
            delete formData.engineNumber;
            return;
        }

        if (mode === ProductsDetailMode.Edit) {
            // await updateCar({ ...formData, id });
        }
    };

    return (
        <>
            <Card loading={loading} title={getCardTitle()}>
                <Form
                    form={form}
                    {...formItemLayout}
                    layout={"vertical"}
                    autoComplete="off"
                    onFinish={handleFormFinish}
                >
                    <Form.Item name="productId" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        className="flex justify-center"
                        name="listImgUrl"
                        // rules={[{ required: true, message: "Hãy chọn ít nhất 1 ảnh!" }]}
                    >
                        <UploadSinglePictureGetUrl
                            remoteMode={
                                UploadSinglePictureGetUrlRemoteMode.Private
                            }
                            disabled={isReadOnly()}
                            maxCount={5}
                            fileList={fileList}
                            setFileList={setFileList}
                        />
                    </Form.Item>

                    {/* product name */}
                    <Form.Item
                        label="Tên sản phẩm"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên sản phẩm!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </Form.Item>

                    {/* category and brand */}
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                                label="Danh mục xe"
                                name="category_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Chọn danh mục!",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    options={settingData?.categories?.map(
                                        (item) => {
                                            return {
                                                value: item?.id,
                                                label: item?.name,
                                            };
                                        }
                                    )}
                                    placeholder="Chọn danh mục"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="Thương hiệu"
                                name="brand_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Chọn thương hiệu!",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    options={settingData?.branches?.map(
                                        (item) => {
                                            return {
                                                value: item?.id,
                                                label: item?.name,
                                            };
                                        }
                                    )}
                                    placeholder="Chọn thương hiệu"
                                />
                            </Form.Item>
                        </Col>

                        {/* numberVin */}
                        <Col span={6}>
                            <Form.Item
                                label="Số khung"
                                name="numberVin"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập số khung!",
                                    },
                                ]}
                            >
                                <Input
                                    maxLength={255}
                                    readOnly={isReadOnly()}
                                    placeholder="Nhập số khung"
                                />
                            </Form.Item>
                        </Col>
                        {/* EngineNumber */}
                        <Col span={6}>
                            <Form.Item
                                label="Số máy"
                                name="engineNumber"
                                rules={[
                                    { required: false, message: "Chọn model!" },
                                ]}
                            >
                                <Input
                                    maxLength={255}
                                    readOnly={isReadOnly()}
                                    placeholder="Nhập số máy"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* description  */}
                    <Form.Item
                        className="custom-antd-richtext-editor"
                        label="Mô tả sản phẩm"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập nội dung mô tả sản phẩm!",
                            },
                        ]}
                    >
                        <RichTextEditor
                            className="h-[400px] mb-10"
                            readOnly={isReadOnly()}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giá nhập"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Nội dung không được để trống!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="Nhập đơn giá"
                                    formatter={(value) =>
                                        `${value} đ`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    className="w-full"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giá thuê pin"
                                name="price"
                                rules={[
                                    {
                                        required: false,
                                        message:
                                            "Nội dung không được để trống!",
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="Nhập giá thuê"
                                    formatter={(value) =>
                                        `${value} đ`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    className="w-full"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <>
                        <Button onClick={handleCancel}>
                            {getButtonCancelText()}
                        </Button>
                        {isReadOnly() ? (
                            <>
                                <Divider type="vertical" />
                                <Button onClick={handleEdit}>
                                    {getButtonEditText()}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Divider type="vertical" />
                                <Button onClick={handleOk}>
                                    {getButtonOkText()}
                                </Button>
                            </>
                        )}
                    </>
                </Form>
            </Card>
        </>
    );
};

ProductsDetail.propTypes = {
    mode: PropTypes.number,
};

export default ProductsDetail;

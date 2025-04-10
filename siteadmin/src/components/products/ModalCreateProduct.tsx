import {
    Col,
    Form,
    FormInstance,
    Input,
    Row,
    Select,
    Spin,
    TreeSelect,
} from "antd";
import CustomizeModal from "../common/CustomizeModal";
import "./ModalCreateProduct.css";
import { useStore } from "src/stores";
import ReactQuill from "react-quill";
import { useRef, useState } from "react";
import CustomizeEditor from "../common/CustomizeEditor";
import { observer } from "mobx-react-lite";

type TreeSelectType = {
    title: string;
    value: string;
    children?: TreeSelectType[];
};

type BrandSelectType = {
    label: string;
    value: string;
};

interface IModalCreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    okText?: string;
    cancelText?: string;
    form: FormInstance;
    categorySelectData: TreeSelectType[];
    brandSelectData: BrandSelectType[];
}

const ModalCreateProduct: React.FC<IModalCreateProductProps> = ({
    isOpen,
    onClose,
    onSave,
    okText,
    cancelText,
    form,
    categorySelectData,
    brandSelectData,
}) => {
    const store = useStore();
    const quillRef = useRef<ReactQuill>(null);
    const productStore = store.productObservable;
    const [content, setContent] = useState<string>("");
    const handleQuillChange = (content: string, delta, source, editor) => {
        try {
            form.setFieldValue("description", content);
            setContent(content);
        } catch (e) {}
    };
    const [spins, setSpins] = useState(false);
    return (
        <>
            <Spin
                spinning={spins}
                size="large"
                tip="Đang tải lên hình ảnh..."
                fullscreen={true}
            />
            <CustomizeModal
                isOpen={isOpen}
                handleCloseModal={onClose}
                handleSaveModal={onSave}
                okText={okText}
                cancelText={cancelText}
                width={900}
                title="Tạo sản phẩm"
                className="modal-create-product"
            >
                <div className="p-4 bg-white rounded-md flex flex-col gap-4">
                    <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                        Thông tin chung
                    </h2>
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col"
                        preserve={false}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên sản phẩm"
                            name={"title"}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập tên sản phẩm",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập tên sản phẩm"
                                className="w-full p-[0.625rem] h-10 rounded border border-solid border-gray-200"
                                onChange={(e) => {
                                    form.setFieldValue("title", e.target.value);
                                }}
                                autoComplete="off"
                            />
                        </Form.Item>
                        <Row gutter={24}>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="Nhãn hàng"
                                    name={"brand_id"}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn nhãn hàng",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn nhãn hàng"
                                        showSearch
                                        className="h-10"
                                        options={brandSelectData}
                                        onChange={(value) => {
                                            form.setFieldValue(
                                                "brand_id",
                                                value
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="Danh mục"
                                    name={"category_id"}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn danh mục",
                                        },
                                    ]}
                                >
                                    <TreeSelect
                                        placeholder="Chọn danh mục"
                                        showSearch
                                        treeData={categorySelectData}
                                        className="h-10"
                                        onChange={(value) => {
                                            form.setFieldValue(
                                                "category_id",
                                                value
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Mô tả" name={"description"}>
                            <div className="w-full h-[25rem] overflow-hidden border border-solid border-[var(--border-gray)] rounded-md editor-container">
                                <CustomizeEditor
                                    onChange={handleQuillChange}
                                    folder="Cars"
                                    theme="snow"
                                    value={content}
                                    ref={quillRef}
                                    store={productStore}
                                    setSpins={setSpins}
                                    className="w-full h-full"
                                />
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </CustomizeModal>
        </>
    );
};

export default observer(ModalCreateProduct);

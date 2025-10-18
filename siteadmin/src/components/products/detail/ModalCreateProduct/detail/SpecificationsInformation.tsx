import { observer } from "mobx-react-lite";
import { modalCreateProductStore } from "../ModalCreateProduct.store";
import FormListSelectOrInput from "../../FormListSelectOrInput";
import { PlusOutlined } from "@ant-design/icons";
import { FormInstance } from "antd";
import { useCallback } from "react";

interface ISpecificationInformation {
    form: FormInstance;
}

const SpecificationsInformation: React.FC<ISpecificationInformation> = observer(
    ({ form }) => {
        const handleCheckSpec = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                    form.setFieldsValue({
                        specifications: [{ name: "", values: [{ value: "" }] }],
                    });
                    modalCreateProductStore.setShowSpecForm(true);
                } else {
                    modalCreateProductStore.setShowSpecForm(false);
                    form.resetFields(["specifications"]);
                }
            },
            []
        );
        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2
                    className="text-base text-gray-900 font-semibold pb-2 m-0 "
                    style={{
                        borderBottom: "1px solid #d9d9d9",
                    }}
                >
                    Thông số kỹ thuật
                </h2>
                <div
                    className="flex justify-start items-center gap-2 w-full"
                    style={{
                        borderBottom: modalCreateProductStore.showSpecForm
                            ? "1px solid #d9d9d9"
                            : "none",
                        paddingBottom: modalCreateProductStore.showSpecForm
                            ? "1rem"
                            : "0",
                    }}
                >
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            handleCheckSpec(e);
                        }}
                        checked={modalCreateProductStore.showSpecForm}
                        id="specCheck"
                    />
                    <label htmlFor="specCheck" className="text-sm">
                        Chọn để nhập các thông số kỹ thuật của sản phẩm
                    </label>
                </div>
                <div className="flex flex-col gap-4">
                    {modalCreateProductStore.showSpecForm && (
                        <FormListSelectOrInput
                            formListName="specifications"
                            fieldValue="specifications"
                            formItemLabel="Thông số kỹ thuật"
                            placeholderSelect="Chọn thông số kỹ thuật"
                            renderComponent={({ onClick }) => (
                                <button
                                    onClick={onClick}
                                    className="w-full h-10 border-none outline-none cursor-pointer bg-transparent text-base pt-4"
                                    type="button"
                                >
                                    <div className={"text-gray-700 text-base"}>
                                        <PlusOutlined className="mr-1" />
                                        <span>Thêm thông số kỹ thuật</span>
                                    </div>
                                </button>
                            )}
                            showAddValue={false}
                            isSelect={false}
                            form={form}
                        />
                    )}
                </div>
            </div>
        );
    }
);

export default SpecificationsInformation;

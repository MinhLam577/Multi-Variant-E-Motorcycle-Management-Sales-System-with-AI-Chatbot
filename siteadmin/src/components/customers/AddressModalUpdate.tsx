import { useEffect, useState } from "react";
import {
    Divider,
    Form,
    Input,
    message,
    Modal,
    notification,
    Select,
} from "antd";

import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import { useParams } from "react-router";
import { AddressResponseType } from "./AddressModalCreate";

const AddressModalUpdate = (props) => {
    const {
        openAddressModalUpdate,
        setOpenModalUpdate,
        setAddressDataUpdate,
        dataAddressUpdate,
    } = props;
    const [isSubmit, setIsSubmit] = useState(true);
    const [provinces, setProvinces] = useState<AddressResponseType[]>([]);
    const [districts, setDistricts] = useState<AddressResponseType[]>([]);
    const [wards, setWards] = useState<AddressResponseType[]>([]);
    const id = useParams();

    const [form] = Form.useForm();
    useEffect(() => {
        if (dataAddressUpdate) {
            form.setFieldsValue(dataAddressUpdate);
        }
    }, [dataAddressUpdate]);

    const onFinish = async (values) => {
        let province = values.province;
        if (provinces?.length) {
            province =
                provinces.find((p) => p.code === values.province)?.name ||
                province;
        }
        let district = values.district;
        if (districts?.length) {
            district =
                districts.find((d) => d.code === values.district)?.name ||
                district;
        }
        let ward = values.ward;
        if (wards?.length) {
            ward = wards.find((w) => w.code === values.ward)?.name || ward;
        }

        const formData = {
            ...values,
            customerId: values.customerId,
            province: province ? province : null,
            district: district ? district : null,
            ward: ward ? ward : null,
        };

        setIsSubmit(true);
        const res = await apiClient.put(
            endpoints.receive_address.update(dataAddressUpdate.id),
            formData
        );

        if (res && res.data) {
            message.success("Cập nhật địa chỉ thành công");
            form.resetFields();
            setOpenModalUpdate(false);
            props.fetchUser();
        } else {
            notification.error({
                message: "Cập nhật địa chỉ thất bại",
                description:
                    res.data?.message ||
                    "Đã có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại sau.",
            });
        }
        setIsSubmit(false);
    };

    //
    useEffect(() => {
        const fetchProvince = async () => {
            const data = await apiClient.get(endpoints.province.list);
            setProvinces(data.data.data);
        };
        fetchProvince();
    }, []);

    // gọi api tìm district
    const fetchDistrict = async (idProvince) => {
        form.setFieldsValue({ district: undefined, ward: undefined });

        const data = await apiClient.get(
            endpoints.district.districtByName(idProvince)
        );
        setDistricts(data.data.data);
    };

    // gọi api tìm award
    const fetchAward = async (idDistrict) => {
        form.setFieldsValue({ ward: undefined });
        const data = await apiClient.get(endpoints.ward.wardByName(idDistrict));
        setWards(data.data.data);
    };

    const handleProvinceChange = (value) => {
        fetchDistrict(value);
    };

    const handleDistrictChange = (value) => {
        fetchAward(value);
    };

    return (
        <>
            <Modal
                title="Cập nhật địa chỉ người dùng"
                open={openAddressModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => setOpenModalUpdate(false)}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ customerId: id.id }}
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="id"
                        name="customerId"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên người nhận"
                        name="receiver_name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên người nhận!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="receiver_phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Địa chỉ"
                        name="street"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tỉnh/Thành phố"
                        name="province"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn tỉnh/thành phố!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Select
                            onChange={handleProvinceChange}
                            options={provinces.map((p) => ({
                                value: p.code,
                                label: p.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quận/Huyện"
                        name="district"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn quận/huyện!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Select
                            onChange={handleDistrictChange}
                            options={districts.map((d) => ({
                                value: d.code,
                                label: d.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phường/Xã"
                        name="ward"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn phường/xã!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Select
                            options={wards.map((w) => ({
                                value: w.code,
                                label: w.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mã bưu điện"
                        name="postal_code"
                        labelCol={{ span: 24 }}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
                        labelCol={{ span: 24 }}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default AddressModalUpdate;

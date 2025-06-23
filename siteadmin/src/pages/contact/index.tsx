import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Access from "src/access/access";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import CustomizeModal from "src/components/common/CustomizeModal";
import CustomizeTab from "src/components/common/CustomizeTab";
import ContactSearch from "src/components/contact/ContactSearch";
import ContactTable from "src/components/contact/ContactTable";
import { RegExps } from "src/constants";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import { getBreadcrumbItems } from "src/containers/layout";
import { useStore } from "src/stores";
import { UpdateBrandDto } from "src/stores/brand.store";
import {
    ContactResponseType,
    CreateContactDto,
    EnumContact,
    globalFilterContactType,
    UpdateContactDto,
} from "src/stores/contact.store";
import { paginationData } from "src/stores/voucher";

const ContactPage = () => {
    const store = useStore();
    const contactStore = store.contactObservable;
    const [globalFilters, setGlobalFilters] = useState<globalFilterContactType>(
        {
            search: undefined,
            created_from: undefined,
            created_to: undefined,
            service: undefined,
        }
    );

    const fetchContact = async (
        query?:
            | (globalFilterContactType & paginationData)
            | globalFilterContactType
            | paginationData
    ) => {
        try {
            await contactStore.getListContact(query);
        } catch (error) {
            console.error("Error fetching contact data:", error);
        }
    };

    useEffect(() => {
        fetchContact({
            ...contactStore.pagination,
        });
    }, []);

    useEffect(() => {
        fetchContact({
            ...contactStore.pagination,
            ...globalFilters,
        });
    }, [globalFilters]);

    const handleDeleteContact = async (id: string) => {
        try {
            const res = await contactStore.deleteContact(id);
            if (res) {
                store.setStatusMessage(
                    200,
                    "",
                    "Xóa thông tin liên hệ thành công",
                    true
                );
                fetchContact({
                    ...contactStore.pagination,
                    ...globalFilters,
                });
            }
        } catch (e) {
            console.error("Error deleting contact:", e);
        }
    };

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [createForm] = Form.useForm<CreateContactDto>();
    const handleSaveCreateModal = async () => {
        createForm.submit();
    };

    const handleCancelCreateModal = () => {
        setOpenModalCreate(false);
        createForm.resetFields();
    };

    const handleSubmitCreateForm = async (values: CreateContactDto) => {
        try {
            const res = await contactStore.createContact(values);
            if (res) {
                store.setStatusMessage(
                    200,
                    "",
                    "Tạo thông tin liên hệ thành công",
                    true
                );
                fetchContact({
                    ...contactStore.pagination,
                    ...globalFilters,
                });
                handleCancelCreateModal();
            }
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    };

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [updateForm] = Form.useForm<UpdateContactDto>();
    const [updateModalData, setUpdateModalData] =
        useState<UpdateContactDto | null>(null);
    const handleUpdateContact = (item: ContactResponseType) => {
        setUpdateModalData(item);
        setOpenModalUpdate(true);
        updateForm.setFieldsValue({
            id: item.id,
            email: item.email,
            name: item.name,
            maintenance_date: item.maintenance_date,
            note: item.note,
            phone: item.phone,
            service: item.service,
        });
    };
    const handleSaveUpdateModal = async () => {
        updateForm.submit();
    };
    const handleCancelUpdateModal = () => {
        setOpenModalUpdate(false);
        updateForm.resetFields();
    };

    const handleSubmitUpdateModal = async (values: UpdateContactDto) => {
        if (!updateModalData) return;
        try {
            const { id, ...restValues } = values;
            const res = await contactStore.updateContact(
                updateModalData.id,
                restValues
            );
            if (res) {
                store.setStatusMessage(
                    200,
                    "",
                    "Cập nhật thông tin liên hệ thành công",
                    true
                );
                fetchContact({
                    ...contactStore.pagination,
                    ...globalFilters,
                });
                handleCancelUpdateModal();
            }
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };
    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách các thông tin liên hệ của khách hàng"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />

                    <Access
                        permission={ALL_PERMISSIONS.CONTACT.CREATE}
                        hideChildren
                    >
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setOpenModalCreate(true)}
                        >
                            Tạo mới
                        </Button>
                    </Access>
                </div>
            </div>
            <div className="w-full mt-4 mb-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả thông tin liên hệ",
                            children: (
                                <div className="w-full mt-2">
                                    <ContactSearch
                                        setFilters={setGlobalFilters}
                                    />
                                    <ContactTable
                                        data={contactStore.data || []}
                                        handleDeleteContact={
                                            handleDeleteContact
                                        }
                                        handleUpdateContact={
                                            handleUpdateContact
                                        }
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <CustomizeModal
                isOpen={openModalCreate}
                okText="Lưu"
                cancelText="Hủy"
                title="Tạo mới thông tin liên hệ"
                handleCloseModal={handleCancelCreateModal}
                handleSaveModal={handleSaveCreateModal}
            >
                <Form<CreateContactDto>
                    form={createForm}
                    layout="vertical"
                    onFinish={handleSubmitCreateForm}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name={"name"}
                                label="Tên khách hàng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"phone"}
                                label="Số điện thoại"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại",
                                    },
                                    {
                                        pattern: RegExps.PhoneNumber,
                                        message: "Số điện thoại không hợp lệ",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"email"}
                                label="Email"
                                rules={[
                                    {
                                        type: "email",
                                        message: "Email không hợp lệ",
                                    },
                                    {
                                        required: true,
                                        message: "Vui lòng nhập email",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"note"}
                                label="Ghi chú"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Nhập ghi chú"
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"service"}
                                label="Dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn dịch vụ",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn dịch vụ"
                                    options={Object.keys(EnumContact).map(
                                        (key) => ({
                                            label: EnumContact[
                                                key as keyof typeof EnumContact
                                            ],
                                            value: EnumContact[
                                                key as keyof typeof EnumContact
                                            ],
                                        })
                                    )}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"maintenance_date"}
                                label="Ngày bảo trì"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập ngày bảo trì" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </CustomizeModal>

            <CustomizeModal
                isOpen={openModalUpdate}
                okText="Lưu"
                cancelText="Hủy"
                title="Cật nhật thông tin liên hệ"
                handleCloseModal={handleCancelUpdateModal}
                handleSaveModal={handleSaveUpdateModal}
            >
                <Form<UpdateContactDto>
                    form={updateForm}
                    layout="vertical"
                    onFinish={handleSubmitUpdateModal}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name={"name"}
                                label="Tên khách hàng"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập tên",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"phone"}
                                label="Số điện thoại"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại",
                                    },
                                    {
                                        pattern: RegExps.PhoneNumber,
                                        message: "Số điện thoại không hợp lệ",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"email"}
                                label="Email"
                                rules={[
                                    {
                                        type: "email",
                                        message: "Email không hợp lệ",
                                    },
                                    {
                                        required: true,
                                        message: "Vui lòng nhập email",
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"note"}
                                label="Ghi chú"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Nhập ghi chú"
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"service"}
                                label="Dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn dịch vụ",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn dịch vụ"
                                    options={Object.keys(EnumContact).map(
                                        (key) => ({
                                            label: EnumContact[
                                                key as keyof typeof EnumContact
                                            ],
                                            value: EnumContact[
                                                key as keyof typeof EnumContact
                                            ],
                                        })
                                    )}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"maintenance_date"}
                                label="Ngày bảo trì"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập ngày bảo trì" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </CustomizeModal>
        </section>
    );
};

export default observer(ContactPage);

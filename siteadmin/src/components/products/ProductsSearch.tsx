import { SearchOutlined } from "@ant-design/icons";
import {
    Button,
    Form,
    FormInstance,
    Input,
    Select,
    Tooltip,
    TreeSelect,
    Col,
    Row,
    Grid,
    GetProps,
} from "antd";
import React from "react";
import { useStore } from "src/stores";
import debounce from "lodash/debounce";
const { Search } = Input;

type TreeSelectType = {
    title: string;
    value: string;
    children?: TreeSelectType[];
};

type BrandSelectType = {
    label: string;
    value: string;
};

type IProductsSearchProps = {
    form: FormInstance;
    categorySelectData: TreeSelectType[];
    brandSelectData: BrandSelectType[];
};

type SearchProps = GetProps<typeof Input.Search>;

const ProductsSearch: React.FC<IProductsSearchProps> = ({
    form,
    categorySelectData,
    brandSelectData,
}) => {
    const store = useStore();
    const productStore = store.productObservable;
    const onFinish = (values) => {};
    const onSearch: SearchProps["onSearch"] = (value, e) => {};
    const onSearchDebounced = debounce((value: string) => {
        productStore.setGlobalFilter({
            search: value,
        });
    }, 500);

    return (
        <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ flex: "30%" }}
            labelWrap
            layout="vertical"
            className="flex flex-col gap-2"
        >
            <Row gutter={16}>
                <Col xl={8} lg={24} md={24} xs={12}>
                    <Form.Item
                        label={<span className="font-bold">Search</span>}
                        name="search"
                    >
                        <Tooltip
                            title={
                                <span className="text-xs text-gray-400 font-semibold">
                                    Nhập mã sản phẩm, tên sản phẩm
                                </span>
                            }
                            placement="topLeft"
                            arrow={true}
                            color="#000"
                            trigger={"hover"}
                            open={false}
                        >
                            <Search
                                name="search"
                                allowClear
                                placeholder="Nhập thông tin cần tìm"
                                onChange={(e) => {
                                    onSearchDebounced(e.target.value);
                                }}
                                onFocus={() => {}}
                                onBlur={() => {}}
                                onMouseEnter={() => {}}
                                onMouseLeave={() => {}}
                                enterButton
                                onSearch={onSearch}
                                autoComplete="off"
                                size="large"
                            />
                        </Tooltip>
                    </Form.Item>
                </Col>
                <Col xl={6} lg={8} md={8} xs={12}>
                    <Form.Item
                        label={<span className="font-bold">Danh mục</span>}
                        name="categoryName"
                    >
                        <TreeSelect
                            allowClear
                            showSearch
                            placeholder="Chọn danh mục"
                            treeDefaultExpandAll
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: "auto",
                            }}
                            treeData={categorySelectData}
                            treeNodeFilterProp="title"
                            onChange={(value, label, extra) => {
                                productStore.setGlobalFilter({
                                    categoryID: value,
                                });
                            }}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xl={6} lg={8} md={8} xs={12}>
                    <Form.Item
                        label={<span className="font-bold">Nhãn hàng</span>}
                        name="brand"
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn nhãn hàng"
                            optionFilterProp="label"
                            options={brandSelectData}
                            onChange={(value) => {
                                productStore.setGlobalFilter({
                                    brandID: value,
                                });
                            }}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xl={4} lg={8} md={8} xs={12}>
                    <Form.Item
                        label={<span className="font-bold">Trạng thái</span>}
                        name="status"
                    >
                        <Select
                            allowClear
                            showSearch
                            placeholder="Chọn trạng thái"
                            optionFilterProp="label"
                            options={[
                                {
                                    label: "Hiển thị",
                                    value: true,
                                },
                                {
                                    label: "Ẩn",
                                    value: false,
                                },
                            ]}
                            onChange={(value) => {
                                productStore.setGlobalFilter({
                                    status: value,
                                });
                            }}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ProductsSearch;

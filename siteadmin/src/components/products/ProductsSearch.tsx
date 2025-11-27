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
import { useStore } from "@/stores";
import debounce from "lodash/debounce";
import { EnumProductStore, EnumProductType } from "@/types/product.type";
const { Search } = Input;

type TreeSelectType = {
    title: string;
    value: string;
    children?: TreeSelectType[];
};

type SelectType = {
    label: string;
    value: string;
};

type IProductsSearchProps = {
    form: FormInstance;
    categorySelectData: TreeSelectType[];
    brandSelectData: SelectType[];
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
    const productTypeOption: SelectType[] = Object.keys(EnumProductType).map(
        (key) => ({
            label: EnumProductType[key as keyof typeof EnumProductType],
            value: EnumProductStore[key as keyof typeof EnumProductStore],
        })
    );

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
                <Col xl={5} lg={24} md={24} xs={24}>
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
                                size="middle"
                            />
                        </Tooltip>
                    </Form.Item>
                </Col>
                <Col xl={5} lg={12} md={12} xs={24}>
                    <Form.Item
                        label={<span className="font-bold">Loại xe</span>}
                        name="type"
                    >
                        <Select
                            placeholder="Chọn loại xe"
                            showSearch
                            options={productTypeOption}
                            optionFilterProp="label"
                            allowClear
                            size="middle"
                            onChange={(value) => {
                                productStore.setGlobalFilter({
                                    type: value,
                                });
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col xl={5} lg={12} md={12} xs={24}>
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
                            onChange={(value) => {
                                productStore.setGlobalFilter({
                                    categoryID: value,
                                });
                            }}
                            size="middle"
                        />
                    </Form.Item>
                </Col>
                <Col xl={5} lg={12} md={12} xs={24}>
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
                            size="middle"
                        />
                    </Form.Item>
                </Col>
                <Col xl={4} lg={12} md={12} xs={24}>
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
                                    value: false,
                                },
                                {
                                    label: "Ẩn",
                                    value: true,
                                },
                            ]}
                            onChange={(value) => {
                                productStore.setGlobalFilter({
                                    status: value,
                                });
                            }}
                            size="middle"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ProductsSearch;

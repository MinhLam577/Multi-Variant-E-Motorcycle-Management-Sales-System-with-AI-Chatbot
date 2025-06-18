import { Button, Image } from "antd";
import { observer } from "mobx-react-lite";
import TableComponent from "src/containers/TableComponent";
import { useStore } from "src/stores";
import { BrandResponseType } from "src/stores/brand.store";
import GroupActionButton from "src/components/GroupActionButton";
import moment from "moment";
import { DateTimeFormat } from "src/constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals.js";
import { ALL_MODULES } from "src/constants/permissions";
export interface IBrandsTableProps {
    data: BrandResponseType[];
    handleDeleteBrands: (id: string) => void;
    handleViewOrUpdateBrands: (item: BrandResponseType) => void;
}
const BrandsTable: React.FC<IBrandsTableProps> = ({
    data,
    handleDeleteBrands,
    handleViewOrUpdateBrands,
}) => {
    const store = useStore();
    const brandStore = store.brandObservable;
    const getColumnsConfig = ({
        handleEditBrands,
        handleDeleteBrands,
    }): Array<any> => {
        return [
            {
                title: "Nhãn hàng",
                dataIndex: "name",
                key: "name",
                render: (value: string, item: BrandResponseType) => {
                    return (
                        <div className="flex items-center gap-2 justify-start w-full">
                            <div className="w-14 h-14 shrink-0 flex justify-center items-center">
                                <Image
                                    className="w-full h-full object-cover rounded-md"
                                    src={item.thumbnailUrl}
                                    fallback="/images/default_product_image.jpg"
                                />
                            </div>
                            <div className="">
                                <Button
                                    type="link"
                                    className="items-center justify-start p-0"
                                    onClick={() => handleEditBrands(item)}
                                >
                                    {value}
                                </Button>
                            </div>
                        </div>
                    );
                },
                width: "30%",
            },
            {
                title: "Mô tả",
                dataIndex: "description",
                key: "description",
                render: (value) => {
                    return <span className="text-sm">{value}</span>;
                },
                ellipsis: true,
                width: "40%",
            },
            {
                title: "Ngày tạo",
                dataIndex: "created_at",
                key: "created_at",
                render: (value) => {
                    return (
                        <span className="text-sm">
                            {moment(value).format(DateTimeFormat.TimeStamp)}
                        </span>
                    );
                },
                ellipsis: false,
                width: "20%",
            },
            {
                title: "Thao tác",
                dataIndex: "action",
                key: "action",
                render: (_value, item) => {
                    return (
                        <GroupActionButton
                            handleDelete={() => {
                                processWithModals(
                                    ProcessModalName.ConfirmCustomContent
                                )(
                                    "Xác nhận",
                                    `Bạn có chắc chắn muốn xóa nhãn hàng "${item.name}"?`
                                )(() => handleDeleteBrands(item.id));
                            }}
                            handleUpdate={handleEditBrands}
                            item={item}
                            moduleName={ALL_MODULES.BRANDS}
                        />
                    );
                },
            },
        ];
    };
    return (
        <TableComponent
            getColumnsConfig={() =>
                getColumnsConfig({
                    handleEditBrands: handleViewOrUpdateBrands,
                    handleDeleteBrands: handleDeleteBrands,
                })
            }
            data={data}
            size="large"
            loading={brandStore.loading}
            observableName={brandStore.constructor.name}
            rowKey="id"
            scroll={{ y: "200px" }}
        />
    );
};

export default observer(BrandsTable);

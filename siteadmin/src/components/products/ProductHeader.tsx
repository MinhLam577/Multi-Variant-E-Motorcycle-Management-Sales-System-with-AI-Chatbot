import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getBreadcrumbItems } from "@/containers/layout";
import AdminBreadCrumb from "../common/AdminBreadCrumb";
import Access from "@/access/access";
import { ALL_PERMISSIONS } from "@/constants/permissions";

interface ProductHeaderProps {
    onCreateNew: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
    onCreateNew,
    className,
}) => {
    return (
        <div
            className={`flex justify-between items-center mb-4 ${className ? className : ""}`}
        >
            <AdminBreadCrumb
                description="Thông tin chi tiết về danh sách sản phẩm"
                items={getBreadcrumbItems(location.pathname)}
            />
            <Access
                permission={ALL_PERMISSIONS.PRODUCTS.CREATE}
                hideChildren={true}
            >
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={onCreateNew}
                        size="large"
                        className="!rounded-none"
                    >
                        Tạo sản phẩm
                    </Button>
                </div>
            </Access>
        </div>
    );
};

export default ProductHeader;

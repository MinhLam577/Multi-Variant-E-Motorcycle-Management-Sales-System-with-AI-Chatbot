import { PlusCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import { getBreadcrumbItems } from "src/containers/layout";

interface ProductHeaderProps {
    onCreateNew: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onCreateNew }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <Breadcrumb
                style={{
                    margin: "0.25rem 0 1rem 0",
                }}
                items={[...getBreadcrumbItems(location.pathname)]}
            />
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
        </div>
    );
};

export default ProductHeader;

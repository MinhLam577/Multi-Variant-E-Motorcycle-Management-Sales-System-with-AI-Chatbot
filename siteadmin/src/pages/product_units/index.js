import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { GlobalContext } from "../../contexts/global";
import ProductUnitsTable from "../../components/product_units/ProductUnitsTable";

const ProductUnits = () => {
    const navigate = useNavigate();
    const { globalDispatch } = useContext(GlobalContext);

    const handleAddProducts = () => {
        navigate("/product_units/add", { replace: true });
    };

    const handleEditProducts = (productsData) => {
        globalDispatch({
            type: "breadcrum",
            data: productsData.name,
        });
        navigate(`/product_units/${productsData.productUnitId}/edit`, {
            replace: true,
        });
    };

    const handleViewProducts = (productsData) => {
        globalDispatch({
            type: "breadcrum",
            data: productsData.name,
        });
        navigate(`/product_units/${productsData.productUnitId}`, {
            replace: true,
        });
    };

    return (
        <>
            <div className="w-full flex justify-between">
                <Space className="my-4 flex flex-row justify-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddProducts}
                    >
                        Tạo mới
                    </Button>
                </Space>
            </div>
            <ProductUnitsTable
                handleEditProducts={handleEditProducts}
                handleViewProducts={handleViewProducts}
            />
        </>
    );
};

export default ProductUnits;

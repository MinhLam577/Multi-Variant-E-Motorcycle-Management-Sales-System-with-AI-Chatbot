import ModalCreateProduct, {
    IModalCreateProductProps,
} from "../ModalCreateProduct/ModalCreateProduct";
import React from "react";
import { observer } from "mobx-react-lite";

interface IModalUpdateProductProps extends IModalCreateProductProps {
    productId: string;
    initialData: Record<string, any>;
}

const ModalUpdateProduct: React.FC<IModalUpdateProductProps> = observer(
    ({ productId, initialData, ...props }: IModalUpdateProductProps) => {
        return (
            <ModalCreateProduct
                {...props}
                title="Cật nhật sản phẩm"
                formInitialValues={initialData ? initialData : {}}
                productId={productId}
            />
        );
    }
);

export default ModalUpdateProduct;

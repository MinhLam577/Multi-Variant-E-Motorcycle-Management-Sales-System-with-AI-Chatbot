import { useStore } from "@/context/store.context";
import {
    EnumProductSortBy,
    globalFilterType,
    ProductType,
} from "@/src/stores/productStore";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useEffect } from "react";

export interface IListGridFilterProps {
    data: ProductType;
    setQueryObject: Dispatch<SetStateAction<globalFilterType>>;
    queryObject: globalFilterType;
}

const ListGridFilter: React.FC<IListGridFilterProps> = ({
    data,
    setQueryObject,
    queryObject,
}) => {
    const store = useStore();
    const storeProduct = store.productObservable;
    useEffect(() => {
        if (!storeProduct.data.product_sort_by.length) {
            storeProduct.getProductSortBy();
        }
    }, []);
    const getListOption = () => {
        const productSortBy = toJS(storeProduct.data.product_sort_by);
        const options: {
            value: string;
            label: string;
        }[] = productSortBy.map((item) => ({
            value: item.value,
            label: item.label,
        }));
        return options;
    };

    const selectOptions = getListOption().map((option) => (
        <option key={option.value} value={option.value}>
            {option.label}
        </option>
    ));

    return (
        <div className="listing_filter_row db-767">
            <div className="col-md-4">
                <div className="page_control_shorting left_area tac-sm mb30-767 mt15">
                    <p>
                        Chúng tôi tìm thấy{" "}
                        <span className="heading-color fw600">
                            {data.length}
                        </span>{" "}
                        xe sẵn sàng cho bạn
                    </p>
                </div>
            </div>
            <div className="col-md-8">
                <div className="page_control_shorting right_area text-end tac-xsd">
                    <ul>
                        <li className="list-inline-item short_by_text listone">
                            Sắp xếp theo:
                        </li>
                        <li className="list-inline-item listwo">
                            <select
                                className="form-select show-tick "
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setQueryObject((prev) => ({
                                        ...prev,
                                        sort_by: value as EnumProductSortBy,
                                    }));
                                }}
                                value={queryObject.sort_by}
                            >
                                {selectOptions}
                            </select>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default observer(ListGridFilter);

import { Button, Tag } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { EnumOrderStatuses } from "../../constants";
const OrderStatusSearch = ({ order_status, order_store }) => {
    const button_extra_style = {
        color: "default",
        variant: "solid",
    };
    const [button_focus, set_button_focus] = useState(false);
    const [status_selected, set_status_selected] = useState("All");

    return (
        <div className="flex flex-wrap justify-between items-center gap-y-4 ">
            {order_status?.map((status) => {
                const isSelected = status_selected === status.key;
                return (
                    <Button
                        key={status.key}
                        onClick={() => {
                            set_button_focus(!button_focus);
                            set_status_selected(status.key);
                            order_store?.setOrderStatusSelected(status.key);
                        }}
                        {...(isSelected ? button_extra_style : {})}
                        size="middle"
                    >
                        <span className="text-sm font-semibold">
                            #
                            {EnumOrderStatuses[status.key]
                                .toLowerCase()
                                .split(" ")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                .join(" ")}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
};

OrderStatusSearch.propTypes = {
    order_status: PropTypes.array,
    order_store: PropTypes.object,
};

export default OrderStatusSearch;

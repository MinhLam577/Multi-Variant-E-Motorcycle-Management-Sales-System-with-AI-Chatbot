import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import OrderSearch from "../../components/orders/OrderSearch";
import OrdersTable from "../../components/orders/OrdersTable";
import ExportOrder from "./ExportOrder";
import OrderDetail from "./OrderDetail";
import { useStore } from "../../stores";

const Orders = () => {
    const location = useLocation();

    const [globalFilters, setGlobalFilters] = useState({ searchText: null });
    const [openDrawer, setOpenDrawer] = useState(false);
    const [orderNo, setOrderNo] = useState("");

    const handleViewOrders = (orderData) => {
        setOrderNo(orderData.orderNo);
        setOpenDrawer(true);
    };

    const store = useStore();
    const orderStore = store.orderObservable;
    useEffect(() => {
        const fetchData = async () => {
            const query = "current=1&pageSize=10";
            const result = await orderStore.getListOrder(query);
            return result;
        };
        const data = fetchData();
        console.log(data);
    }, []);

    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };

    useEffect(() => {
        const search = location.search;
        if (search.includes("?status=new")) {
            setGlobalFilters({ ...globalFilters, status: ["NEW"] });
        } else if (search.includes("?status=confirmed")) {
            setGlobalFilters({ ...globalFilters, status: ["CONFIRMED"] });
        } else if (search.includes("?status=delivering")) {
            setGlobalFilters({ ...globalFilters, status: ["DELIVERING"] });
        } else if (search.includes("?status=completed")) {
            setGlobalFilters({
                ...globalFilters,
                status: ["FAILED", "DELIVERED", "CANCELED"],
            });
        } else {
            setGlobalFilters({ ...globalFilters, status: null });
        }
    }, [location]);

    return (
        <div className="flex flex-col gap-4">
            <OrderSearch
                showStatus={location.search ? false : true}
                setFilters={setGlobalFilters}
            />
            <Drawer
                title="Chi tiết đơn hàng"
                placement={"right"}
                closable={false}
                onClose={onCloseDrawer}
                open={openDrawer}
                key={"right"}
                size={"large"}
            >
                <OrderDetail refreshOrders={() => {}} orderNo={orderNo} />
            </Drawer>
            <OrdersTable
                globalFilters={globalFilters}
                handleViewOrders={handleViewOrders}
                loadData={() => {}}
                data={[]}
                loading={false}
            />
        </div>
    );
};

export default Orders;

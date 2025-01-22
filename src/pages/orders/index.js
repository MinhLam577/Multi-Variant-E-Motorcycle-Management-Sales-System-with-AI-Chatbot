import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import OrderSearch from "../../businessComponents/orders/OrderSearch";
import OrdersTable from "../../businessComponents/orders/OrdersTable";
import ExportOrder from "./ExportOrder";
import OrderDetail from "./OrderDetail";

const Orders = () => {
  const location = useLocation();

  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  const handleViewOrders = (orderData) => {
    setOrderNo(orderData.orderNo);
    setOpenDrawer(true);
  };

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
    <>
      <OrderSearch
        showStatus={location.search ? false : true}
        setFilters={setGlobalFilters}
      />
      <ExportOrder globalFilters={globalFilters} />
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
    </>
  );
};

export default Orders;

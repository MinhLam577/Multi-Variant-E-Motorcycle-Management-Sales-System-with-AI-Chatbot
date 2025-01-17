import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, updateCar } from "../../../api/cars";
import { RequestStatus } from "../../../constants";
import Loading from "../../../containers/Loading";
import {
  ProcessModalName,
  processWithModals,
} from "../../../containers/processWithModals";
import { GlobalContext } from "../../../contexts/global";
import { useStore } from "../../../stores";
import EMotorbikeScreen from "./EMotorbikeScreen";

const EMotorbike = observer(() => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const { productObservable } = useStore();
  useEffect(() => {
    return reaction(
      () => productObservable.status,
      (status, prevStatus) => {
        handleLoginEvents(prevStatus, status);
      }
    );
  }, []);

  console.log("productObservable", productObservable.listEMotorbike);
  useEffect(() => {
    productObservable.getListMotorBike({ page: 1, size: 5 });
  }, []);

  const handleLoginEvents = (prevStatus, status) => {
    if (prevStatus === "submitting") {
      setIsLoading(false);
    }
    switch (status) {
      case RequestStatus.SUBMITTING: {
        setIsLoading(true);
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleAddProducts = () => {
    navigate("/e-motorbike/add", { replace: true });
  };

  const handleEditProducts = (productsData) => {
    globalDispatch({
      type: "breadcrum",
      data: productsData.name,
    });
    navigate(`/products/${productsData.id}/edit`, { replace: true });
  };

  const handleViewProducts = (productsData) => {
    globalDispatch({
      type: "breadcrum",
      data: productsData.name,
    });
    navigate(`/e-motorbike/${productsData.id}`, { replace: true });
  };

  const handleDeleteProducts = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa sản phẩm này?"
    )(() => {
      console.log("remote id", id);
      deleteProduct(id).then((res) => {
        console.log("remote id", res);
      });
    });
  };

  const handleStatusProducts = (item, statusProduct) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      statusProduct
        ? "Bạn chắc chắn muốn hiển thị sản phẩm này?"
        : "Bạn chắc chắn muốn ẩn sản phẩm này?"
    )(() => {
      updateCar({ id: item.id, status: statusProduct });
    });
  };

  console.log("aaaa", productObservable.listEMotorbike);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <EMotorbikeScreen
        handleAddProducts={handleAddProducts}
        handleDeleteProducts={handleDeleteProducts}
        handleStatusProducts={handleStatusProducts}
        handleViewProducts={handleViewProducts}
        handleEditProducts={handleEditProducts}
        data={productObservable?.listEMotorbike}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
    </>
  );
});

export default EMotorbike;

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, message, Popconfirm } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { Empty } from "antd";
import { formatCurrency } from "@/utils";
const CartItems = ({
  cartListObserver,
  selectedItems,
  setSelectedItems,
  setSelectedAllItems,
  cartObservable,
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [tempQuantities, setTempQuantities] = useState({});
  const handleDeleteItem = async (itemId) => {
    console.log(itemId);

    await cartObservable.deleteCartByID(itemId);
    if (cartObservable.status == 200) {
      message.success(cartObservable.successMsg);
    } else {
      message.error(cartObservable.errorMsg);
    }
  };

  const handleTempQuantityChange = (itemId, value) => {
    setTempQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };
  const handleQuantityBlur = async (itemId) => {
    const inputVal = Number(tempQuantities[itemId]);
    const quantity = isNaN(inputVal) || inputVal < 1 ? 1 : inputVal;

    const item = cartListObserver.find((i) => i.id === itemId);
    console.log(quantity);
    await cartObservable.UpdateQuantityCart(itemId, { quantity: quantity });
    setTempQuantities((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  // Cập nhật cartItems khi cartList thay đổi
  useEffect(() => {
    if (cartListObserver && cartListObserver.length > 0) {
      setCartItems(cartListObserver);
    }
  }, [cartListObserver]); // Chạy lại mỗi khi cartList thay đổi

  // dùng state bình thuong
  // const handleCheckboxChange = (itemId) => {
  // setSelectedItems((prevSelected) => {
  //     let newSelected;
  //     if (prevSelected.includes(itemId)) {
  //       newSelected = prevSelected.filter((id) => id !== itemId); // Bỏ chọn
  //     } else {
  //       newSelected = [...prevSelected, itemId]; // Thêm chọn
  //     }

  //     // Sau khi cập nhật xong selectedItems, kiểm tra luôn
  //     setSelectedAllItems(newSelected.length === cartListObserver.length);

  //     return newSelected;
  //   });
  // };

  const handleCheckboxChange = async (itemId) => {
    const prevSelected = await cartObservable.getSelectedItems(); // 🟢 Lấy giá trị cũ từ observable

    let newSelected;
    if (prevSelected.includes(itemId)) {
      newSelected = prevSelected.filter((id) => id !== itemId);
    } else {
      newSelected = [...prevSelected, itemId];
    }

    cartObservable.setSelectedItems(newSelected); // 🟢 Cập nhật lại

    // Cập nhật state local nếu cần
    setSelectedAllItems(newSelected.length === cartListObserver.length);
  };

  if (!cartListObserver || cartListObserver.length === 0) {
    return (
      <div className="p-5 h4">
        <Empty />
      </div>
    );
  }
  const cancel = () => {};
  console.log(selectedItems);
  return (
    <>
      {cartListObserver?.map((item) => (
        <tr key={item.id}>
          {/* THÊM checkbox vào đây */}
          <td className="text-center">
            <input
              type="checkbox"
              checked={selectedItems?.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
            />
          </td>
          <th className="pl30" scope="row">
            <ul className="cart_list mt20">
              <li className="list-inline-item">
                <Link href="/shop-single">
                  <Image
                    width={70}
                    height={70}
                    quality={30}
                    src={item?.skus?.image}
                    alt="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0r1nxglujkfeb@resize_w48_nl.webp"
                  />
                </Link>
              </li>

              <li className="list-inline-item ">
                <div className="flex flex-col">
                  <Link className="cart_title" href="/shop-single">
                    {item.skus.product.title}
                  </Link>
                  <Link className="cart_title" href="/shop-single">
                    {item.skus.name}
                  </Link>
                </div>
              </li>
            </ul>
          </th>
          <td>{formatCurrency(item.skus.price_sold)}</td>
          <td>
            <input
              className="cart_count text-center border px-2 py-1 rounded w-16"
              type="number"
              min="1"
              value={tempQuantities[item.id] ?? item.quantity}
              onChange={(e) =>
                handleTempQuantityChange(item.id, e.target.value)
              }
              onBlur={() => handleQuantityBlur(item.id)}
            />
          </td>
          <td>
            {formatCurrency(
              (item.total = item.quantity * item.skus.price_sold)
            )}
          </td>
          <td className="pr25">
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn muốn xóa sản phẩm?"
              onConfirm={() => handleDeleteItem(item.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <div className="pointer" title="Delete">
                <span className="flaticon-trash" />
              </div>
            </Popconfirm>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CartItems;
// onClick={() => handleDeleteItem(item.id)}
// {item.skus.name}
// {
//   id: 1,
//   imageSrc: "/images/shop/cart1.png",
//   title: "Silver Heinz Ketchup 350 ml",
//   price: "$298",
//   quantity: 4,
//   total: "$1,298",
// },
// {
//   id: 2,
//   imageSrc: "/images/shop/cart2.png",
//   title: "Silver Heinz Ketchup 350 ml",
//   price: "$298",
//   quantity: 4,
//   total: "$1,298",
// },
// {
//   id: 3,
//   imageSrc: "/images/shop/cart3.png",
//   title: "Silver Heinz Ketchup 350 ml",
//   price: "$298",
//   quantity: 4,
//   total: "$1,298",
// },

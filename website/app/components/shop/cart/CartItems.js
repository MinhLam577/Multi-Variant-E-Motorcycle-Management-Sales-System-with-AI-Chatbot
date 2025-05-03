"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, message, Popconfirm } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect } from "react";
import { Empty } from "antd";
const CartItems = ({
  cartList,
  selectedItems,
  setSelectedItems,
  setSelectedAllItems,
}) => {
  const [cartItems, setCartItems] = useState([]);

  const handleDeleteItem = (itemId) => {
    console.log(itemId);
  };

  const handleQuantityChange = (itemId, value) => {
    // Chỉ cập nhật sản phẩm đã thay đổi thay vì cập nhật toàn bộ cartItems
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: value } : item
    );
    setCartItems(updatedItems);
  };

  // Cập nhật cartItems khi cartList thay đổi
  useEffect(() => {
    if (cartList && cartList.length > 0) {
      setCartItems(cartList);
    }
  }, [cartList]); // Chạy lại mỗi khi cartList thay đổi

  // Sử dụng debounce để giảm tần suất gọi API
  const handleQuantityBlur = useCallback(
    debounce((itemId, value) => {
      console.log("Blur quantity:", itemId, value);
      // Gọi API cập nhật dữ liệu ở đây nếu cần
    }, 500), // 500ms delay
    []
  );

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) => {
      let newSelected;
      if (prevSelected.includes(itemId)) {
        newSelected = prevSelected.filter((id) => id !== itemId); // Bỏ chọn
      } else {
        newSelected = [...prevSelected, itemId]; // Thêm chọn
      }

      // Sau khi cập nhật xong selectedItems, kiểm tra luôn
      setSelectedAllItems(newSelected.length === cartList.length);

      return newSelected;
    });
  };

  if (!cartList || cartList.length === 0) {
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
      {cartItems?.map((item) => (
        <tr key={item.id}>
          {/* THÊM checkbox vào đây */}
          <td className="text-center">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
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
                    src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0r1nxglujkfeb@resize_w48_nl.webp"
                    alt="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0r1nxglujkfeb@resize_w48_nl.webp"
                  />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link className="cart_title" href="/shop-single">
                  {item.skus.name}
                </Link>
              </li>
            </ul>
          </th>
          <td>{item.skus.price_sold}</td>
          <td>
            <input
              className="cart_count text-center"
              value={item.quantity}
              type="number"
              min="1"
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
              onBlur={(e) => handleQuantityBlur(item.id, e.target.value)}
            />
          </td>
          <td>{(item.total = item.quantity * item.skus.price_sold)}</td>
          <td className="pr25">
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn muốn xóa sản phẩm?"
              onConfirm={() => handleDeleteItem(item.id)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <div
                className="pointer"
                title="Delete"
                onClick={() => handleDeleteItem(item.id)}
              >
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

import gql from "graphql-tag";

export const GET_ORDERS_LIST = gql`
  query orders($filterOrderInput: FilterOrderInput!) {
    orders: orders(filterOrderInput: $filterOrderInput) {
      data {
        createdById
        created_at
        orderAddress {
          country
          district
          province
          receiverName
          receiverPhone
          street
          userAddressId
          ward
        }
        createdBy {
          userId
          fullname
          phone
        }
        totalPrice
        orderId
        orderNo
        status
        updated_at
        orderProductCombos {
          comboName
          comboId
          numberPeople
          products {
            productName
            productId
            quantity
            oneUnit
            price
            totalPrice
            unit
          }
          comboPrice
        }
      }
      total
    }
  }
`;

export const GET_ORDER = gql`
  query order($orderNo: String!) {
    order(orderNo: $orderNo) {
      orderNo
      createdBy {
        userId
        fullname
        phone
      }
      orderProducts {
        productName
        productId
        quantity
        oneUnit
        price
        totalPrice
        unit
      }
      orderProductCombos {
        comboName
        comboId
        numberPeople
        products {
          productName
          productId
          quantity
          oneUnit
          price
          totalPrice
          unit
        }
        comboPrice
      }
      orderAddress {
        country
        district
        province
        receiverName
        receiverPhone
        street
        userAddressId
        ward
      }
      orderVouchers {
        discountCode
        discountName
        discountType
        discountValue
      }
      totalPrice
      totalDiscount
      shipmentFee
      status
      note
      updated_at
      created_at
      expectedDeliveryTime
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($updateOrderInput: UpdateOrderInput!) {
    updateOrder(updateOrderInput: $updateOrderInput) {
      status
      error
    }
  }
`;

export const GET_ORDER_LOGS = gql`
  query order($orderId: String!) {
    order(orderId: $orderId) {
      createdBy {
        address
        created_at
        email
        fullname
        phone
        role
        status
        userCode
        userId
      }
      createdById
      created_at
      orderId
      orderLogId
      status
      updated_at
    }
  }
`;

export const GET_ORDER_NOS = gql`
  query getOrderNos {
    getOrderNos {
      text
      value
    }
  }
`;

export const GET_ORDER_CREATED_BYS = gql`
  query getOrderCreatedBys {
    getOrderCreatedBys {
      text
      value
    }
  }
`;

export const GET_ORDER_STATUSES = gql`
  query getOrderStatuses {
    getOrderStatuses {
      text
      value
    }
  }
`;

export const EXPORT_ORDER = gql`
  query exportOrdersV2(
    $orderStatuses: [String!]!
    $fromDate: DateTime!
    $toDate: DateTime!
  ) {
    exportOrdersV2(
      orderStatuses: $orderStatuses
      fromDate: $fromDate
      toDate: $toDate
    ) {
      fileResultUrl
    }
  }
`;

export const EXPORT_ORDER_PRODUCTS = gql`
  query exportOrderProducts($month: Float!, $year: Float!) {
    exportOrderProducts(month: $month, year: $year) {
      fileResultUrl
      fileResultName
      status
    }
  }
`;

export const GET_ORDERS_NO = gql`
  query orders($filterOrderInput: FilterOrderInput!) {
    orders: orders(filterOrderInput: $filterOrderInput) {
      data {
        orderId
        orderNo
      }
      total
    }
  }
`;

export const GET_ORDERS_MATERIAL = gql`
  query getOrderMaterial($getOrderMaterialInput: GetOrderMaterialInput!) {
    getOrderMaterial(getOrderMaterialInput: $getOrderMaterialInput) {
      productName
      productId
      quantity
      oneUnit
      price
      totalPrice
      unit
    }
  }
`;

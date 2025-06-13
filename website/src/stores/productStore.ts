import { makeAutoObservable, toJS } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { paginationData, RootStore } from "./base";
import ProductAPI from "src/api/product";
import { ResponsePromise } from "src/api/order";
import { EnumProductStore } from "./product.store";
import SkusAPI from "../api/skus";

export enum EnumProductType {
  CARS = "Xe hơi",
  MOTOBIKES = "Xe máy điện",
}

interface OptionGroup {
  option_value_ids: string[];
}

interface OptionValuesPayload {
  optionValues: OptionGroup[];
}

export type globalFilterType = {
  search?: string;
  price_max?: number;
  price_min?: number;
  brandID?: string;
  categoryID?: string;
  status?: boolean;
  type?: EnumProductStore;
};

export type OptionValueResponseType = {
  id: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};
export type skus_OptionValue_ResponseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  masku: string;
  barcode: string;
  name: string;
  price_sold: string;
  price_compare: string;
  image: string | null;
  status: boolean;
  optionValue: OptionValueResponseType[];
};

export type ConvertSkusOptionValue_UI = {
  id: string;
  createdAt: string;
  name: string;
  option_values: {
    id: string;
    value: string;
    image: string | null; // Thêm trường image
  }[];
};
export type DetailImportResponseType = {
  id: string;
  price_import: string;
  quantity_import: number;
  quantity_sold: number;
  lot_name: string;
  quantity_remaining: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
};
export type SkusDataResponseType = {
  id: string;
  masku: string;
  barcode: string;
  name: string;
  price_sold: string;
  price_compare: string;
  image: string | null;
  status: boolean;
  detail_import?: DetailImportResponseType[];
};
export type ProductDataResponseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  slug_product: string;
  title: string;
  type: EnumProductStore;
  description?: string;
  images?: string[];
  status?: boolean;
  skus?: SkusDataResponseType[];
};
type ProductData = {
  cars: {
    data: any[] | null;
    bestSelling: ProductDataResponseType[] | null; // Thêm trường bestSelling nếu cần
  };
  motobikes: {
    data: any[] | null;
    bestSelling: ProductDataResponseType[] | null;
  };
  cars_motobikes: {
    data: any[];
  };
  dataDetail: {
    data: any;
  };
  resultOption_OptionValue: ConvertSkusOptionValue_UI[];
  optionValues: OptionValuesPayload;
  dataSKU: null;
};

class ProductObservable {
  status: number | null = null;
  errorMessage: string = null;
  successMessage: string = null;
  showSuccessMessage: boolean = false;
  rootStore: RootStore;
  pagination: paginationData = {
    current: 1,
    pageSize: 10,
  };
  data: ProductData = {
    cars: {
      data: [],
      bestSelling: [], // Thêm trường bestSelling nếu cần
    },
    motobikes: {
      data: [],
      bestSelling: [], // Thêm trường bestSelling nếu cần
    },
    cars_motobikes: {
      data: [],
    },
    dataDetail: {
      data: "",
    },
    resultOption_OptionValue: [],
    dataSKU: null,
    optionValues: null,
  };
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }
  setStatusMessage(
    status: number,
    errorMessage: string,
    successMessage: string,
    showSuccess: boolean = false
  ) {
    if (status) this.status = status;
    if (errorMessage) this.errorMessage = errorMessage;
    if (successMessage) this.successMessage = successMessage;
    this.showSuccessMessage = showSuccess;
  }

  clearStatusMessage() {
    this.errorMessage = null;
    this.successMessage = null;
    this.status = null;
    this.showSuccessMessage = false;
  }

  private validateQuery(query: string | object): string {
    const parseQuery: paginationData & globalFilterType = {
      ...(typeof query === "string"
        ? Object.fromEntries(new URLSearchParams(query))
        : query),
      ...this.pagination,
    };

    const { search, price_max, price_min, brandID, categoryID, status, type } =
      parseQuery;
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (price_max) queryParams.append("price_max", price_max.toString());
    if (price_min) queryParams.append("price_min", price_min.toString());
    if (brandID) queryParams.append("brandID", brandID);
    if (categoryID) queryParams.append("categoryID", categoryID);
    if (type) queryParams.append("type", type);
    if (status !== undefined) {
      queryParams.append("status", status.toString());
    }
    queryParams.append("current", parseQuery.current.toString());
    queryParams.append("pageSize", parseQuery.pageSize.toString());
    return queryParams.toString();
  }

  *getListProduct(
    query:
      | string
      | (paginationData & globalFilterType)
      | paginationData
      | globalFilterType,
    type: EnumProductStore = EnumProductStore.CAR
  ) {
    try {
      const queryString = this.validateQuery(query);
      const response: ResponsePromise = yield ProductAPI.getListProduct(
        queryString
      );
      const { data, status, message } = response;
      const resData = data?.data;
      if (SUCCESS_STATUSES.includes(status)) {
        if (type === EnumProductStore.CAR) {
          this.data.cars.data = resData;
        } else if (type === EnumProductStore.MOTORBIKE) {
          this.data.motobikes.data = resData;
        }
        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
    } catch (e: any) {
      console.error(e);
      this.setStatusMessage(0, e?.message, "");
    }
  }

  *getBestSellingProducts(type: EnumProductStore) {
    try {
      const response: ResponsePromise = yield ProductAPI.getBestSellingProducts(
        type
      );
      const { data, status, message } = response;
      if (SUCCESS_STATUSES.includes(status)) {
        if (type === EnumProductStore.CAR) {
          this.data.cars.bestSelling = data;
        } else if (type === EnumProductStore.MOTORBIKE) {
          this.data.motobikes.bestSelling = data;
        }
        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
      return response;
    } catch (e: any) {
      console.error(e);
      this.setStatusMessage(0, e?.message, "");
      throw e;
    }
  }

  // product cho trang home
  *getListProductHome(queryString) {
    const queryString1 = new URLSearchParams(queryString).toString();
    try {
      const response: ResponsePromise = yield ProductAPI.getListProduct(
        queryString1
      );
      const { data, status, message } = response;
      const resData = data?.data;
      if (SUCCESS_STATUSES.includes(status)) {
        this.data.cars_motobikes.data = resData;

        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
    } catch (e: any) {
      console.error(e);
      this.setStatusMessage(0, e?.message, "");
    }
  }

  //
  *getListProductBuyMany(queryString, type) {
    const queryString1 = new URLSearchParams(queryString).toString();
    try {
      const response: ResponsePromise = yield ProductAPI.getListProduct(
        queryString1
      );
      const { data, status, message } = response;
      const resData = data?.data;
      if (SUCCESS_STATUSES.includes(status)) {
        if (type === EnumProductType.CARS) {
          this.data.cars.data = resData;
        } else if (type === EnumProductType.MOTOBIKES) {
          this.data.motobikes.data = resData;
        }
        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
    } catch (e: any) {
      console.error(e);
      this.setStatusMessage(0, e?.message, "");
    }
  }

  *getDetailProductByID(id) {
    try {
      const response: ResponsePromise = yield ProductAPI.getDetailProduct(id);
      const { data, status, message } = response;
      const resData = data;
      if (SUCCESS_STATUSES.includes(status)) {
        this.data.dataDetail.data = resData;
        // Chuyển dữ liệu về dạng mới kèm theo image của sku
        const result: ConvertSkusOptionValue_UI[] =
          this.data.dataDetail.data.skus.reduce((acc, sku) => {
            sku.optionValue.forEach((optionValue) => {
              const existingOption = acc.find(
                (item) => item.name === optionValue.option.name
              );
              if (existingOption) {
                existingOption.option_values.push({
                  id: optionValue.id,
                  value: optionValue.value,
                  image: sku.image, // Thêm image của SKU vào option_value
                });
              } else {
                acc.push({
                  name: optionValue.option.name,
                  id: optionValue.option.id,
                  option_values: [
                    {
                      id: optionValue.id,
                      value: optionValue.value,
                      image: sku.image, // Thêm image của SKU vào option_value
                    },
                  ],
                });
              }
            });
            return acc;
          }, []);

        this.data.resultOption_OptionValue = result;
        yield this.get_detailProducts_user_page_id(id);
        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
    } catch (e: any) {
      console.error(e);
      this.setStatusMessage(0, e?.message, "");
    }
  }

  //     {
  //   "optionValues": [
  //     {
  //       "option_value_ids": [
  //         "ce74692b-f3d5-4cb5-8131-4ea892d17ddc",
  //         "8f5b8356-8f7f-45b1-83e2-eb5568fa4eb9"
  //       ]
  //     },
  //     {
  //       "option_value_ids": [
  //         "7e963a8a-4d82-4fa2-a5a0-783884c1a345",
  // "ec30fb2f-ff38-4469-b489-abae0397d0ae"
  //       ]
  //     }
  //   ]
  // }

  *getDetailSKU_ByOptionValue(id) {
    try {
      const response: ResponsePromise = yield ProductAPI.getDetailSKU(id);
      const { data, status, message } = response;
      const resData = data;
      if (SUCCESS_STATUSES.includes(status)) {
        this.data.dataSKU = resData;
        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
    } catch (e: any) {
      console.error(e);
      this.setStatusMessage(0, e?.message, "");
    }
  }
  *GetSkusByOptionValueIds(optionValuesPayload: {
    optionValues: { option_value_ids: string[] }[];
  }) {
    try {
      const { data, status, message } = yield SkusAPI.GetSkusByOptionValueIds(
        optionValuesPayload
      );
      console.log(data[0]);

      if (SUCCESS_STATUSES.includes(status)) {
        this.data.dataSKU = data[0];
        console.log(this.data.dataSKU);
        this.setStatusMessage(200, "", message);
      } else {
        this.setStatusMessage(0, message, "");
      }
    } catch (error) {
      console.error("Lỗi khi gọi GetSkusByOptionValueIds:", error);
      this.setStatusMessage(0, "Lỗi gọi API", "");
    }
  }

  *get_detailProducts_user_page_id(id: string) {
    try {
      const response: ResponsePromise =
        yield ProductAPI.getDetailProduct_getOptionValue(id);
      const { data, status, message } = response;
      this.data.optionValues = data.optionValues;
      console.log(this.data.optionValues);
    } catch (error) {}
  }
}

export default ProductObservable;

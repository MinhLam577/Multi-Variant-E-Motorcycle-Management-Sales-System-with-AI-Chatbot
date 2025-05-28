import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import {
    Bill,
    Profile2User,
    DollarCircle,
    ArchiveBox,
    ArrowDown2,
    UserAdd,
    ArrowDown,
    ArrowSwapVertical,
} from "iconsax-react";
import { Select, ConfigProvider, DatePicker, Skeleton, message } from "antd";
import dayjs from "dayjs";
import qs from "qs";
import { makeAutoObservable, reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { EnumOrderColorStatuses, EnumOrderStatuses } from "src/constants";
import { getBreadcrumbItems } from "src/containers/layout";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { RevenueProfitStatisticsDto } from "src/stores/order.store";
import OrderAPI from "src/api/order.api";
import { RootStore } from "src/stores/base";
import { useStore } from "src/stores";
import { filterEmptyFields, getErrorMessage } from "src/utils";
import apiClient from "src/api/apiClient";
import endpoints from "src/api/endpoints";
const { RangePicker } = DatePicker;

const filterTheme = {
    token: {
        colorTextPlaceholder: "#1D242E",
        colorTextDisabled: "#1D242E",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        controlOutline: "none",
        colorBorder: "#e8ebed",
        borderRadius: 4,
        colorPrimary: "#008f99",
    },
    components: {
        DatePicker: {
            activeBorderColor: "#1D242E",
            hoverBorderColor: "#1D242E",
        },
        Select: {
            activeBorderColor: "#1D242E",
            hoverBorderColor: "#1D242E",
            optionActiveBg: "rgb(0, 143, 153, 0.3)",
            optionSelectedBg: "rgb(0, 143, 153, 0.3)",
            optionSelectedColor: "#1D242E",
        },
    },
};

interface IEarningSeriesProps {
    data: number[];
    name: string;
    type?: string;
}
export interface StatisticsResponse {
    monthly_revenue: number[];
    monthly_profit: number[];
    revenue_daily: number[];
    profit_daily: number[];
}
export enum EnumTypeOfTimeStatistics {
    MONTH = "month",
    DAY = "day",
}
interface DailyStats {
    date: string;
    revenue: number;
    profit: number;
}

interface MonthlyStats {
    month: string;
    revenue: number;
    profit: number;
}

const orderLabels = Object.entries(EnumOrderStatuses)
    .filter(([key]) => key !== "All")
    .map(([_, value]) => value);
const getRandomNumberRange = (min: number, max: number, count: number) => {
    return Array.from(
        { length: count },
        () => Math.floor(Math.random() * (max - min + 1)) + min
    );
};

const convertAmountToUnit = (amount: number): string => {
    const units = [
        { threshold: 1000000000, unit: "B", divider: 1000000000 }, // Tỷ
        { threshold: 1000000, unit: "M", divider: 1000000 }, // Triệu
        { threshold: 1000, unit: "K", divider: 1000 }, // Nghìn
    ];

    // Xử lý số âm
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);

    // Tìm đơn vị phù hợp
    for (const { threshold, unit, divider } of units) {
        if (absAmount >= threshold) {
            const value = absAmount / divider;
            const formattedValue = Number.isInteger(value)
                ? value
                : Number(value.toFixed(1));
            return `${isNegative ? "-" : ""}${formattedValue}${unit}`;
        }
    }

    // Trả về số nguyên hoặc số thập phân nhỏ
    return isNegative ? `-${absAmount}` : `${absAmount}`;
};

const orderColor = Object.entries(EnumOrderStatuses)
    .map(
        ([key, value]) =>
            EnumOrderColorStatuses[key as keyof typeof EnumOrderColorStatuses]
    )
    .filter(Boolean);

const getDefaultRange = (
    current_year: number,
    type: EnumTypeOfTimeStatistics = EnumTypeOfTimeStatistics.MONTH
) => {
    // Kiểm tra tính hợp lệ của current_year
    if (!current_year || isNaN(current_year)) {
        current_year = dayjs().year();
    }

    if (type === EnumTypeOfTimeStatistics.MONTH) {
        // Trả về khoảng từ đầu năm đến cuối năm
        const startOfYear = dayjs(`${current_year}-01-01`).startOf("year");
        const endOfYear = dayjs(`${current_year}-01-01`).endOf("year");
        return {
            start_date: startOfYear.format("YYYY-MM-DD"),
            end_date: endOfYear.format("YYYY-MM-DD"),
        };
    } else {
        // Trả về khoảng từ đầu tháng hiện tại đến cuối tháng hiện tại trong current_year
        const currentMonth = dayjs().month(); // Lấy tháng hiện tại (0-11)
        const startOfMonth = dayjs(
            `${current_year}-${currentMonth + 1}-01`
        ).startOf("month");
        const endOfMonth = startOfMonth.endOf("month");
        return {
            start_date: startOfMonth.format("YYYY-MM-DD"),
            end_date: endOfMonth.format("YYYY-MM-DD"),
        };
    }
};
class OverviewStore {
    products: number = 0;
    customers: number = 0;
    suppliers: number = 0;
    orders: number = 0;
    totalRevenue: number = 0;
    profitAndRevenue: StatisticsResponse = {
        monthly_revenue: [],
        monthly_profit: [],
        revenue_daily: [],
        profit_daily: [],
    };
    earningSeries: IEarningSeriesProps[] = [
        {
            name: "Profit",
            data: getRandomNumberRange(0, 0, 12),
            type: "line",
        },
        {
            name: "Revenue",
            data: getRandomNumberRange(0, 0, 12),
            type: "column",
        },
    ];
    earningOptions: ApexOptions = {
        colors: ["#817AF3", "#46A46C"],
        fill: {
            type: ["gradient", "gradient"],
            gradient: {
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "#817AF3",
                            opacity: 1,
                        },
                        {
                            offset: 48,
                            color: "#74B0FA",
                            opacity: 1,
                        },
                        {
                            offset: 100,
                            color: "#79D0F1",
                            opacity: 1,
                        },
                    ],
                    [
                        {
                            offset: 0,
                            color: "#46A46C",
                            opacity: 1,
                        },
                        {
                            offset: 48,
                            color: "#51CC5D",
                            opacity: 1,
                        },
                        {
                            offset: 100,
                            color: "#57DA65",
                            opacity: 1,
                        },
                    ],
                ],
            },
        },
        chart: {
            type: "line",
            height: 350,
            toolbar: {
                show: true,
                tools: { download: true },
            },
            zoom: { enabled: true },
            animations: {
                enabled: true,
                speed: 600, // Animation mỗi thanh mất 600ms
                animateGradually: {
                    enabled: true,
                    delay: 70, // Mỗi thanh xuất hiện cách nhau 70ms
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 300, // Animation khi cập nhật dữ liệu mất 300ms
                },
            },
        },
        dataLabels: {
            enabledOnSeries: [0],
            enabled: true,
            style: {
                colors: ["#000"],
            },
            background: {
                enabled: true,
                padding: 2,
                borderRadius: 2,
                borderColor: "#000",
            },
            formatter: function (val) {
                return typeof val === "number"
                    ? convertAmountToUnit(val).toString()
                    : String(val);
            },
        },
        plotOptions: { bar: { columnWidth: "40%", borderRadius: 5 } },
        tooltip: {
            hideEmptySeries: false,
            shared: true,
            intersect: false,
            enabledOnSeries: [0, 1],
            enabled: true,
        },
        noData: {
            text: "The data is not available",
            align: "center",
            verticalAlign: "middle",
        },
        stroke: {
            width: [4, 0],
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return typeof val === "number"
                        ? convertAmountToUnit(val).toString()
                        : String(val);
                },
            },
        },
    };
    orderPieSeries: number[] = getRandomNumberRange(0, 0, orderLabels.length);
    orderPieOptions: ApexOptions = {
        ...(orderColor.length > 0 ? { colors: orderColor } : {}),
        chart: {
            type: "pie",
            toolbar: {
                show: false,
            },
            width: "100%",
            height: 400,
            animations: {
                enabled: true,
                speed: 700, // Animation mỗi phần mất 700ms
                animateGradually: {
                    enabled: true,
                    delay: 80, // Mỗi phần xuất hiện cách nhau 80ms
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 300, // Animation khi cập nhật dữ liệu mất 300ms
                },
            },
        },
        labels: orderLabels,
        legend: {
            show: true,
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            position: "bottom",
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };
    year: number = dayjs().year();
    showSkeleton: boolean = false;
    start_date: string = null;
    end_date: string = null;
    selectType: EnumTypeOfTimeStatistics = EnumTypeOfTimeStatistics.MONTH;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
        reaction(
            () => ({
                year: this.year,
                selectType: this.selectType,
            }),
            (current_value) => {
                const { year: current_year, selectType } = current_value;
                const { start_date, end_date } = getDefaultRange(
                    current_year,
                    selectType
                );
                this.setDateRange(start_date, end_date);
            },
            { fireImmediately: true }
        );
    }
    setSelectType(selectType: EnumTypeOfTimeStatistics) {
        this.selectType = selectType;
        const { start_date, end_date } = getDefaultRange(this.year, selectType);
        this.setDateRange(start_date, end_date);
    }
    setProducts(products: number) {
        this.products = products;
    }
    setCustomers(customers: number) {
        this.customers = customers;
    }
    setSuppliers(suppliers: number) {
        this.suppliers = suppliers;
    }
    setOrders(orders: number) {
        this.orders = orders;
    }
    setTotalRevenue(totalRevenue: number) {
        this.totalRevenue = totalRevenue;
    }
    setProfitAndRevenue(profitAndRevenue: StatisticsResponse) {
        this.profitAndRevenue = profitAndRevenue;
    }
    setEarningSeries(earningSeries: IEarningSeriesProps[]) {
        this.earningSeries = earningSeries;
    }
    setEarningOptions(earningOptions: ApexOptions) {
        this.earningOptions = earningOptions;
    }
    setOrderPieSeries(orderPieSeries: number[]) {
        this.orderPieSeries = [...orderPieSeries];
    }
    setOrderPieOptions(orderPieOptions: ApexOptions) {
        this.orderPieOptions = orderPieOptions;
    }
    setYear(year: number) {
        this.year = year;
    }
    setShowSkeleton(showSkeleton: boolean) {
        this.showSkeleton = showSkeleton;
    }
    setDateRange(start_date: string, end_date: string) {
        this.start_date = start_date;
        this.end_date = end_date;
        this.updateStatistics();
    }

    private async fetchDailyStatistics(
        start: string | null,
        end: string | null
    ) {
        if (!start || !end) return { type: "daily", data: [] };

        const startDate = dayjs(start).startOf("day");
        const endDate = dayjs(end).endOf("day");

        try {
            const payload: RevenueProfitStatisticsDto = {
                time_type: EnumTypeOfTimeStatistics.DAY,
                year: startDate.year(),
                month: startDate.month() + 1,
                startDay: startDate.date(),
                endDay: endDate.date(),
            };

            const {
                data: response,
                message: responseMessage,
                status,
            } = await OrderAPI.profitStatistic(payload);
            if (status !== 200) {
                return { type: "monthly", data: [] };
            }
            const resData = response as StatisticsResponse;
            const data: DailyStats[] =
                resData?.profit_daily?.map((profit, index) => {
                    const date = startDate.add(index, "day");
                    return {
                        date: date.format("DD/MM/YYYY"),
                        revenue: resData.revenue_daily[index] || 0,
                        profit: profit || 0,
                    };
                }) || [];

            return { type: "daily", data };
        } catch (error) {
            console.error("Error fetching daily statistics:", error);
            return { type: "daily", data: [] };
        }
    }

    private async fetchMonthlyStatistics(
        start: string | null,
        end: string | null
    ) {
        if (!start || !end) return { type: "monthly", data: [] };

        const startDate = dayjs(start).startOf("month");
        const endDate = dayjs(end).endOf("month");

        try {
            const payload: RevenueProfitStatisticsDto = {
                time_type: EnumTypeOfTimeStatistics.MONTH,
                month: startDate.month() + 1,
                year: startDate.year(),
                startMonth: startDate.month() + 1,
                endMonth: endDate.month() + 1,
            };

            const {
                data: response,
                message: responseMessage,
                status,
            } = await OrderAPI.profitStatistic(payload);
            if (status !== 200) {
                message.error(
                    responseMessage ||
                        "Có lỗi xảy ra khi lấy dữ liệu thống kê theo tháng."
                );
                return { type: "monthly", data: [] };
            }
            const resData = response as StatisticsResponse;
            const data: MonthlyStats[] =
                resData?.monthly_revenue?.map((revenue, index) => ({
                    month: startDate.add(index, "month").format("MM/YYYY"),
                    revenue,
                    profit: resData.monthly_profit[index] || 0,
                })) || [];

            return { type: "monthly", data };
        } catch (error) {
            console.error("Error fetching monthly statistics:", error);
            return { type: "monthly", data: [] };
        }
    }

    async updateStatistics() {
        if (this.selectType === EnumTypeOfTimeStatistics.DAY) {
            const stats = await this.fetchDailyStatistics(
                this.start_date,
                this.end_date
            );
            this.earningSeries = [
                {
                    name: "Profit",
                    data: stats.data.map((d) => d.profit),
                    type: "line",
                },
                {
                    name: "Revenue",
                    data: stats.data.map((d) => d.revenue),
                    type: "column",
                },
            ];
            this.earningOptions = {
                ...this.earningOptions,
                labels: stats.data.map((d) => d.date),
            };
        } else {
            const stats = await this.fetchMonthlyStatistics(
                this.start_date,
                this.end_date
            );
            this.earningSeries = [
                {
                    name: "Profit",
                    data: stats.data.map((d: MonthlyStats) => d.profit),
                    type: "line",
                },
                {
                    name: "Revenue",
                    data: stats.data.map((d: MonthlyStats) => d.revenue),
                    type: "column",
                },
            ];
            this.earningOptions = {
                ...this.earningOptions,
                labels: stats.data.map((d) => d.month),
            };
        }
    }

    get getTimeUnitList(): string[] {
        if (!this.start_date || !this.end_date) return [];

        if (this.selectType === EnumTypeOfTimeStatistics.MONTH) {
            const start = dayjs(this.start_date).startOf("month");
            const end = dayjs(this.end_date).endOf("month");
            const monthsInRange = end.diff(start, "month") + 1;
            const months: string[] = [];

            for (let i = 0; i < monthsInRange; i++) {
                const month = start.add(i, "month").format("MM/YYYY");
                months.push(month);
            }
            return months;
        } else {
            const start = dayjs(this.start_date).startOf("day");
            const end = dayjs(this.end_date).endOf("day");
            const daysInRange = end.diff(start, "day") + 1;
            const days: string[] = [];

            for (let i = 0; i < daysInRange; i++) {
                const day = start.add(i, "day").format("DD/MM/YYYY");
                days.push(day);
            }

            return days;
        }
    }
}
const overviewStore = new OverviewStore();

const Overview = observer(() => {
    const store = useStore();
    const {
        orderObservable: orderStore,
        userObservable: customerStore,
        productObservable: productStore,
        brandObservable: brandStore,
    } = store;
    const disabledSameMonthDate = (
        current,
        { from, type }: { from?: dayjs.Dayjs; type: string }
    ) => {
        if (from) {
            const startOfMonth = from.startOf("month");
            const endOfMonth = from.endOf("month");
            switch (type) {
                case "year":
                    return current.year() !== from.year();
                case "month":
                    return current.month() !== from.month();
                default:
                    return (
                        current.isBefore(startOfMonth) ||
                        current.isAfter(endOfMonth)
                    );
            }
        }
        return current && current.year() !== overviewStore.year;
    };

    const disabledSameMonthYear = (
        current,
        { from, type }: { from?: dayjs.Dayjs; type: string }
    ) => {
        if (from) {
            switch (type) {
                case "year":
                    return current.year() !== from.year();
            }
        }
        return current && current.year() !== overviewStore.year;
    };

    const disabledFutureDate = (current) => {
        return current && current.year() > dayjs().year();
    };

    const fetchAllCustomers = async () => {
        try {
            const query = qs.stringify(
                filterEmptyFields({
                    ...customerStore.pagination,
                })
            );
            const response = await apiClient.get(
                endpoints.customers.list(query)
            );
            const data = response?.data?.result || [];
            overviewStore.setCustomers(data?.length || 0);
        } catch (err) {
            const errorMessage = getErrorMessage(
                err,
                "Không thể lấy dữ liệu khách hàng"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const fetchAllOrders = async () => {
        try {
            await orderStore.getListOrder({
                ...orderStore.pagination,
            });
            const orders = toJS(orderStore.data.orders);
            if (orders) {
                overviewStore.setOrders(orders.length);
            } else {
                overviewStore.setOrders(0);
            }
        } catch (err) {
            const errorMessage = getErrorMessage(
                err,
                "Không thể lấy dữ liệu đơn hàng"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const fetchAllProducts = async () => {
        try {
            await productStore.getListProduct({
                ...productStore.pagination,
            });
            const products = toJS(productStore.data.products.data);
            if (products) {
                overviewStore.setProducts(products.length);
            } else {
                overviewStore.setProducts(0);
            }
        } catch (err) {
            const errorMessage = getErrorMessage(
                err,
                "Không thể lấy dữ liệu sản phẩm"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const fetchAllSuppliers = async () => {
        try {
            await brandStore.getListBrands({
                ...brandStore.pagination,
            });
            const suppliers = toJS(brandStore.data);
            if (suppliers) {
                overviewStore.setSuppliers(suppliers.length);
            } else {
                overviewStore.setSuppliers(0);
            }
        } catch (err) {
            const errorMessage = getErrorMessage(
                err,
                "Không thể lấy dữ liệu nhà cung cấp"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const fetchTotalRevenue = async (year?: number) => {
        try {
            const currentYear = year || overviewStore.year;
            await orderStore.getTotalRevenueByYear(currentYear);
            const totalRevenue = toJS(orderStore.data.total_revenue_by_year);
            if (totalRevenue) {
                overviewStore.setTotalRevenue(totalRevenue);
            } else {
                overviewStore.setTotalRevenue(0);
            }
        } catch (err) {}
    };

    const fetchOrderOverview = async (year?: number) => {
        try {
            const currentYear = year || overviewStore.year;
            await orderStore.getOrderStatusStatics(currentYear);
            const orderStatusData = toJS(orderStore.data.order_status_statics);
            if (orderStatusData) {
                const orderPieSeries = Object.keys(EnumOrderStatuses)
                    .filter((key) => key !== "All")
                    .map((label) => orderStatusData[label] || 0);
                overviewStore.setOrderPieSeries(orderPieSeries);
            } else {
                overviewStore.setOrderPieSeries(
                    getRandomNumberRange(0, 0, orderLabels.length)
                );
            }
        } catch (err) {
            const errorMessage = getErrorMessage(
                err,
                "Không thể lấy dữ liệu đơn hàng"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const fetchStaticData = async () => {
        await Promise.all([
            fetchTotalRevenue(overviewStore.year),
            fetchOrderOverview(overviewStore.year),
        ]);
    };

    const fetchData = async () => {
        overviewStore.setShowSkeleton(true);
        try {
            await Promise.all([
                fetchAllCustomers(),
                fetchAllOrders(),
                fetchAllProducts(),
                fetchAllSuppliers(),
                fetchStaticData(),
            ]);
            overviewStore.setShowSkeleton(false);
        } catch (err) {
            const errorMessage = getErrorMessage(
                err,
                "Không thể lấy dữ liệu tổng quan"
            );
            store.setStatusMessage(500, errorMessage, "", false);
            overviewStore.setShowSkeleton(false);
        }
    };
    useEffect(() => {
        fetchStaticData();
    }, [overviewStore.year]);

    useEffect(() => {
        fetchData();
    }, []);

    const [display, setDisplay] = useState(false);

    useEffect(() => {
        setTimeout(() => setDisplay(true), 1);
    }, []);

    if (!display) {
        return <></>;
    }

    return (
        <section className="w-full select-none overview__section">
            <Skeleton
                loading={overviewStore.showSkeleton}
                active
                paragraph={{ rows: 16 }}
                title={true}
            >
                <header className="flex justify-between items-center w-full animate-slideLeftToRight">
                    <AdminBreadCrumb
                        description="Một chút tổng quan về dữ liệu của hệ thống"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    <div className="flex gap-8 w-full justify-end">
                        <ConfigProvider theme={filterTheme}>
                            <>
                                <DatePicker
                                    picker="year"
                                    showNow={true}
                                    className="w-[13.438rem] h-12"
                                    suffixIcon={
                                        <ArrowDown2 size="14" color="#1D242E" />
                                    }
                                    allowClear={false}
                                    placeholder={"Chọn năm"}
                                    disabledDate={disabledFutureDate}
                                    value={
                                        overviewStore.year
                                            ? dayjs(
                                                  overviewStore.year.toString()
                                              )
                                            : dayjs()
                                    }
                                    format={"YYYY"}
                                    onChange={(_, dateString) => {
                                        if (!dateString)
                                            overviewStore.setYear(
                                                dayjs().year()
                                            );
                                        else {
                                            overviewStore.setYear(
                                                Number(dateString)
                                            );
                                        }
                                    }}
                                />
                            </>
                        </ConfigProvider>
                    </div>
                </header>
                <div className="my-6 w-full flex flex-col gap-6">
                    <div className="flex w-full items-center gap-8 animate-slideRightToLeft">
                        <div className="w-[20%] border border-solid border-[#01A768] rounded-md overflow-hidden flex flex-col">
                            <div className="bg-[#ffffff] flex justify-stretch items-center gap-2 flex-col py-4">
                                <Profile2User
                                    className="text-[#01A768]"
                                    size={30}
                                />
                                <span className="font-bold text-[1.25rem] text-[#1D242E]">
                                    {`${convertAmountToUnit(overviewStore.customers || 0)}`}
                                </span>
                                <h2 className="font-medium text-sm text-[#1D242E]">
                                    Total Customer
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-[rgb(1,167,104,0.3)] flex items-center justify-center gap-[0.625rem] grow cursor-pointer py-1"
                                style={{
                                    border: "none",
                                    borderTop: "1px solid #01A768",
                                }}
                            >
                                <span className="text-xs text-[#1D242E]">
                                    View Detail
                                </span>
                                <span className="text-xs font-bold text-[#1D242E]">
                                    {">>>"}
                                </span>
                            </button>
                        </div>
                        <div className="w-[20%] border border-solid border-[#817AF3] rounded-md overflow-hidden flex flex-col">
                            <div className="bg-[#ffffff] flex justify-stretch items-center gap-2 flex-col py-4">
                                <Bill className="text-[#817AF3]" size={30} />
                                <span className="font-bold text-[1.25rem] text-[#1D242E]">
                                    {`${convertAmountToUnit(overviewStore.orders || 0)}`}
                                </span>
                                <h2 className="font-medium text-sm text-[#1D242E]">
                                    Total Order
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-[rgb(129,122,243,0.3)] flex items-center justify-center gap-[0.625rem] grow cursor-pointer py-1"
                                style={{
                                    border: "none",
                                    borderTop: "1px solid #c8c6f3",
                                }}
                            >
                                <span className="text-xs text-[#1D242E]">
                                    View Detail
                                </span>
                                <span className="text-xs font-bold text-[#1D242E]">
                                    {">>>"}
                                </span>
                            </button>
                        </div>
                        <div className="w-[20%] border border-solid border-[#03A9F5] rounded-md overflow-hidden flex flex-col">
                            <div className="bg-[#ffffff] flex justify-stretch items-center gap-2 flex-col py-4">
                                <ArchiveBox
                                    className="text-[#03A9F5]"
                                    size={30}
                                />
                                <span className="font-bold text-[1.25rem] text-[#1D242E]">
                                    {`${convertAmountToUnit(overviewStore.products || 0)}`}
                                </span>
                                <h2 className="font-medium text-sm text-[#1D242E]">
                                    Total Products
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-[rgb(3,169,245,0.3)] flex items-center justify-center gap-[0.625rem] grow cursor-pointer py-1"
                                style={{
                                    border: "none",
                                    borderTop: "1px solid #03A9F5",
                                }}
                            >
                                <span className="text-xs text-[#1D242E]">
                                    View Detail
                                </span>
                                <span className="text-xs font-bold text-[#1D242E]">
                                    {">>>"}
                                </span>
                            </button>
                        </div>
                        <div className="w-[20%] border border-solid border-[#F0483E] rounded-md overflow-hidden flex flex-col">
                            <div className="bg-[#ffffff] flex justify-stretch items-center gap-2 flex-col py-4">
                                <DollarCircle
                                    className="text-[#F0483E]"
                                    size={30}
                                />
                                <span className="font-bold text-[1.25rem] text-[#1D242E]">
                                    {`${convertAmountToUnit(overviewStore.totalRevenue || 0)}+`}
                                </span>
                                <h2 className="font-medium text-sm text-[#1D242E]">
                                    Total Revenue
                                </h2>
                            </div>
                            <button
                                className="w-full bg-[rgb(240,72,62,0.3)] flex items-center justify-center gap-[0.625rem] grow cursor-pointer py-1"
                                style={{
                                    border: "none",
                                    borderTop: "1px solid #F0483E",
                                }}
                                onClick={() => {
                                    document
                                        .getElementById("earning__report")
                                        .scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                            >
                                View detail
                                <span className="text-xs font-bold text-[#1D242E]">
                                    <ArrowDown size={15} />
                                </span>
                            </button>
                        </div>
                        <div className="w-[20%] border border-solid border-[#DBA362] rounded-md overflow-hidden flex flex-col">
                            <div className="bg-[#ffffff] flex justify-stretch items-center gap-2 flex-col py-4">
                                <UserAdd className="text-[#DBA362]" size={30} />
                                <span className="font-bold text-[1.25rem] text-[#1D242E]">
                                    {`${convertAmountToUnit(overviewStore.suppliers || 0)}`}
                                </span>
                                <h2 className="font-medium text-sm text-[#1D242E]">
                                    Total Suppliers
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-[rgb(219,163,98,0.2)] flex items-center justify-center gap-[0.625rem] grow cursor-pointer py-1"
                                style={{
                                    border: "none",
                                    borderTop: "1px solid #DBA362",
                                }}
                            >
                                <span className="text-xs text-[#1D242E]">
                                    View Detail
                                </span>
                                <span className="text-xs font-bold text-[#1D242E]">
                                    {">>>"}
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex gap-8">
                        <div
                            className="flex flex-col w-[calc(60%+1rem)] bg-[#ffffff] rounded-xl border border-solid border-[rgb(29,36,46,0.3)]"
                            id="earning__report"
                        >
                            <div className="flex items-center justify-between w-full px-5 pt-5 rounded-xl">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Earning Reports
                                </h2>
                                <div className="flex w-max">
                                    <ConfigProvider
                                        theme={{
                                            ...filterTheme,
                                            token: {
                                                ...filterTheme.token,
                                                colorTextPlaceholder:
                                                    "rgb(24,50,83)",
                                                colorTextDisabled:
                                                    "rgb(156 163 175)",
                                                colorBorder: "#D0D3D9",
                                                borderRadius: 4,
                                            },
                                        }}
                                    >
                                        <Select
                                            options={[
                                                {
                                                    label: "Tháng",
                                                    value: EnumTypeOfTimeStatistics.MONTH,
                                                },
                                                {
                                                    label: "Ngày",
                                                    value: EnumTypeOfTimeStatistics.DAY,
                                                },
                                            ]}
                                            className="h-12 w-28 mr-4"
                                            defaultValue={
                                                EnumTypeOfTimeStatistics.MONTH
                                            }
                                            onChange={(value) => {
                                                overviewStore.setSelectType(
                                                    value
                                                );
                                            }}
                                            suffixIcon={
                                                <ArrowDown2
                                                    size="14"
                                                    color="#1D242E"
                                                />
                                            }
                                        />
                                        {overviewStore.selectType ===
                                        EnumTypeOfTimeStatistics.DAY ? (
                                            <RangePicker
                                                className="h-12 w-60"
                                                suffixIcon={
                                                    <ArrowDown2
                                                        size="14"
                                                        color="#1D242E"
                                                    />
                                                }
                                                format={"DD/MM/YYYY"}
                                                showNow={true}
                                                allowClear={false}
                                                value={
                                                    overviewStore.start_date &&
                                                    overviewStore.end_date &&
                                                    dayjs(
                                                        overviewStore.start_date
                                                    ).isValid() &&
                                                    dayjs(
                                                        overviewStore.end_date
                                                    ).isValid()
                                                        ? [
                                                              dayjs(
                                                                  overviewStore.start_date
                                                              ),
                                                              dayjs(
                                                                  overviewStore.end_date
                                                              ),
                                                          ]
                                                        : [
                                                              dayjs().startOf(
                                                                  "month"
                                                              ),
                                                              dayjs().endOf(
                                                                  "month"
                                                              ),
                                                          ]
                                                }
                                                placement="bottomRight"
                                                disabledDate={
                                                    disabledSameMonthDate
                                                }
                                                onChange={(_, dateString) => {
                                                    const [from, to] =
                                                        dateString;
                                                    if (!from || !to) {
                                                        const currentDate =
                                                            dayjs();
                                                        const startOfMonth =
                                                            currentDate.startOf(
                                                                "month"
                                                            );
                                                        const endOfMonth =
                                                            currentDate.endOf(
                                                                "month"
                                                            );
                                                        overviewStore.setDateRange(
                                                            startOfMonth.format(
                                                                "YYYY-MM-DD"
                                                            ),
                                                            endOfMonth.format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        );
                                                    } else {
                                                        const fromFormatted =
                                                            dayjs(
                                                                from,
                                                                "DD/MM/YYYY"
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            );
                                                        const toFormatted =
                                                            dayjs(
                                                                to,
                                                                "DD/MM/YYYY"
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            );
                                                        overviewStore.setDateRange(
                                                            fromFormatted,
                                                            toFormatted
                                                        );
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <RangePicker
                                                picker="month"
                                                className="h-12 w-60"
                                                suffixIcon={
                                                    <ArrowDown2
                                                        size="14"
                                                        color="#1D242E"
                                                    />
                                                }
                                                disabledDate={
                                                    disabledSameMonthYear
                                                }
                                                format={"MM/YYYY"}
                                                showNow={true}
                                                allowClear={false}
                                                placement="bottomRight"
                                                value={
                                                    overviewStore.start_date &&
                                                    overviewStore.end_date &&
                                                    dayjs(
                                                        overviewStore.start_date
                                                    ).isValid() &&
                                                    dayjs(
                                                        overviewStore.end_date
                                                    ).isValid()
                                                        ? [
                                                              dayjs(
                                                                  overviewStore.start_date
                                                              ),
                                                              dayjs(
                                                                  overviewStore.end_date
                                                              ),
                                                          ]
                                                        : [
                                                              dayjs().startOf(
                                                                  "month"
                                                              ),
                                                              dayjs().endOf(
                                                                  "month"
                                                              ),
                                                          ]
                                                }
                                                onChange={(_, dateString) => {
                                                    const [from, to] =
                                                        dateString;
                                                    if (!from || !to) {
                                                        const currentDate =
                                                            dayjs();
                                                        const startOfMonth =
                                                            currentDate.startOf(
                                                                "month"
                                                            );
                                                        const endOfMonth =
                                                            currentDate.endOf(
                                                                "month"
                                                            );
                                                        overviewStore.setDateRange(
                                                            startOfMonth.format(
                                                                "YYYY-MM-DD"
                                                            ),
                                                            endOfMonth.format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        );
                                                    } else {
                                                        // Chuyển đổi MM/YYYY thành YYYY-MM-DD (đầu và cuối tháng)
                                                        const fromFormatted =
                                                            dayjs(
                                                                from,
                                                                "MM/YYYY"
                                                            )
                                                                .startOf(
                                                                    "month"
                                                                )
                                                                .format(
                                                                    "YYYY-MM-DD"
                                                                );
                                                        const toFormatted =
                                                            dayjs(to, "MM/YYYY")
                                                                .endOf("month")
                                                                .format(
                                                                    "YYYY-MM-DD"
                                                                );
                                                        overviewStore.setDateRange(
                                                            fromFormatted,
                                                            toFormatted
                                                        );
                                                    }
                                                }}
                                            />
                                        )}
                                    </ConfigProvider>
                                </div>
                            </div>
                            <div className="px-5 pt-5 rounded-xl w-full flex justify-center flex-col">
                                <ReactApexChart
                                    options={overviewStore.earningOptions}
                                    series={overviewStore.earningSeries}
                                    width={"100%"}
                                    height={350}
                                    type="line"
                                />
                            </div>
                        </div>
                        <div className="flex items-center flex-col bg-[#ffffff] rounded-xl w-[40%] border border-solid border-[rgb(29,36,46,0.3)]">
                            <div className="flex items-center justify-between w-full px-5 pt-5 rounded-xl">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Order Status
                                </h2>
                            </div>
                            <div className="relative w-full p-5">
                                <div className="gap-4 w-full relative">
                                    <Chart
                                        options={overviewStore.orderPieOptions}
                                        series={overviewStore.orderPieSeries}
                                        type="pie"
                                        width={"100%"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Skeleton>
        </section>
    );
});

export default Overview;

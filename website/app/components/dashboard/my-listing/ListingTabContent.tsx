import ListingContent from "./ListingContent";

const ListingTabContent = () => {
    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    {/* <!-- Nav tabs --> */}
                    <div className="nav nav-tabs justify-content-start">
                        <button
                            className="nav-link active"
                            id="nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-home"
                            aria-controls="nav-home"
                            aria-selected="true"
                        >
                            Tất cả
                        </button>
                        <button
                            className="nav-link"
                            id="nav-shopping-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-shopping"
                            aria-controls="nav-shopping"
                            aria-selected="false"
                        >
                            Xe mới
                        </button>
                        <button
                            className="nav-link"
                            id="nav-hotels-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-hotels"
                            aria-controls="nav-hotels"
                            aria-selected="false"
                        >
                            Xe đã qua sử dụng
                        </button>
                    </div>
                </div>
                {/* <!-- Tab panes --> */}

                <div className="col-lg-12 mt50">
                    <div className="tab-content row" id="nav-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="nav-home"
                            aria-labelledby="nav-home-tab"
                        >
                            <ListingContent />
                        </div>
                        {/* End tab-content */}

                        <div
                            className="tab-pane fade"
                            id="nav-shopping"
                            aria-labelledby="nav-shopping-tab"
                        >
                            <ListingContent />
                        </div>
                        {/* End tab-content */}

                        <div
                            className="tab-pane fade"
                            id="nav-hotels"
                            aria-labelledby="nav-hotels-tab"
                        >
                            <ListingContent />
                        </div>
                    </div>
                    {/* End tab-content */}

                    <div className="mbp_pagination mt10">
                        {/* <Pagination
                            queryObject={{ current: 1, pageSize: 10 }}
                        /> */}
                    </div>
                    {/* Pagination */}
                </div>
            </div>
        </>
    );
};

export default ListingTabContent;

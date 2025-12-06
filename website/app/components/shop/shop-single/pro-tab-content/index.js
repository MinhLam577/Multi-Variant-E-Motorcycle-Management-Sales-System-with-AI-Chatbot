import CommentBox from "./CommentBox";
import Comments from "./Comments";
import ProductDescripitons from "./ProductDescripitons";

const ProductContentTabs = () => {
    return (
        <div className="shop_single_tab_content mt40">
            <ul className="nav nav-tabs justify-content-center" id="myTab2">
                <li className="nav-item">
                    <button
                        className="nav-link active"
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        aria-controls="description"
                        aria-selected="true"
                    >
                        Description
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className="nav-link"
                        id="reviews-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#reviews"
                        type="button"
                        aria-controls="reviews"
                        aria-selected="false"
                    >
                        Reviews (2)
                    </button>
                </li>
            </ul>
            {/* End tabs */}

            <div className="tab-content" id="myTabContent2">
                <div
                    className="tab-pane fade show active"
                    id="description"
                    aria-labelledby="description-tab"
                >
                    <div className="row">
                        <div className="col-lg-8 m-auto">
                            <ProductDescripitons />
                        </div>
                    </div>
                </div>
                {/* End tabs-pane */}

                <div
                    className="tab-pane fade"
                    id="reviews"
                    aria-labelledby="reviews-tab"
                >
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="shop_single_tab_content mb30-991">
                                <div className="product_single_content">
                                    <div className="mbp_pagination_comments">
                                        <h5 className="fz16 mb30">Reviews</h5>
                                        <Comments />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End comments col-6 */}

                        <div className="col-lg-6">
                            <div className="bsp_reveiw_wrt pt30">
                                <CommentBox />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductContentTabs;

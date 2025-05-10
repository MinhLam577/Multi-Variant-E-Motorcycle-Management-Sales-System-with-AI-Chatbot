"use client";
import { useState } from "react";
import AdvanceMainFilter from "./AdvanceMainFilter";import CheckBoxFilter from "./CheckBoxFilter";
import MainFilter from "./MainFilter";
import PriceRange from "./PriceRange";

const AdvanceFilter = ({ handleFilterChange, handleClearAllFilters }) => {
  const handleDeleteAll = () => {
    handleClearAllFilters();
  };

  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="row">
        <MainFilter handleFilterChange={handleFilterChange} />

        <div className="col col-sm-4 col-lg-2">
          <div className="advance_search_style" onClick={() => setOpen(!open)}>
            <a
              className="advance_dd_btn d-inline-flex"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              <span className="flaticon-cogwheel" /> Nâng cao
            </a>
          </div>
        </div>
        {/* End .col */}

        {/*search */}
        <div className="col col-sm-4 col-lg-2">
          <div className="advance_search_style">
            <button
              className="btn search_btn btn-thm"
              onClick={() => handleDeleteAll()}
            >
              Xóa tất cả
            </button>
          </div>
        </div>
        {/* End .col */}
      </div>
      {/* End .row */}

      <div className="mycollapse" id="collapseAdvanceSearch">
        {}

        {/* End .row */}
        {open && (
          <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="advance_search_style">
                <div className="uilayout_range">
                  <h6 className="ass_price_title text-white text-start">Giá</h6>
                  <PriceRange
                    handleFilterChange={handleFilterChange}
                    handleClearAllFilters={handleClearAllFilters}
                  />
                </div>
              </div>
            </div>
            {/* End .col 
                
                
                */}

            <div className="col-sm-6 col-md-4 col-lg-6 ">
              <h6 className="font-600 ass_price_title text-white text-start mb-3">
                {/*Chức năng*/}
              </h6>
              {/* <CheckBoxFilter /> */}
              <CheckBoxFilter />
            </div>
            {/* End .col */}
          </div>
        )}
      </div>
    </>
  );
};

export default AdvanceFilter;
// <div className="row bgc-thm2">
// <AdvanceMainFilter />
// </div>
// <div className="col col-sm-4 col-lg-2">
// <div className="advance_search_style">
//   <a className="btn search_btn btn-thm" href="">
//     <span className="flaticon-magnifiying-glass" /> Xóa tất cả
//   </a>
// </div>
// </div>
// <a
//               className="advance_dd_btn d-inline-flex"
//               href="#collapseAdvanceSearch"
//               data-bs-toggle="mycollapse"
//               role="button"
//               aria-expanded={false}
//               aria-controls="collapseAdvanceSearch"
//             >
//               <span className="flaticon-cogwheel" /> Nâng cao
//             </a>

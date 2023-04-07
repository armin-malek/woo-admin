import {
  faArrowLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LayoutSeller from "../../../../components/LayoutSeller";
import { useState, useEffect } from "react";
import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import SellerCatalogueTableItem from "../../../../components/cp/seller/products/SellerCatalogueTableItem";
import axios from "axios";
import { toast } from "react-toastify";
import SellerProductAddModal from "../../../../components/cp/seller/products/SellerProductAddModal";
import Html5QrcodeScannerPlugin from "../../../../components/cp/seller/products/Html5QrcodeScannerPlugin";
import Paginator from "../../../../components/Paginator";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState();
  const [catalogues, setCatalogues] = useState();
  const [activeItem, setActiveItem] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

  async function LoadCatalogue() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "/api/cp/seller/products/get-catalogue",
        { params: { s: searchTerm, page: pageNum } }
      );
      setIsLoading(false);
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      setCatalogues(data.products);
      setPageNum(data.pagination.pageNumber);
      setPageCount(data.pagination.pageCount);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  function ToggleAddModal(item) {
    if (showAddModal) {
      setShowAddModal(false);
      setActiveItem();
    } else {
      setShowAddModal(true);
      setActiveItem(item);
    }
  }
  async function SubmitBarcode(barCode) {
    try {
      const { data } = await axios.post(
        "/api/cp/seller/products/check-barcode",
        { barCode: barCode }
      );
      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }
      //toast(data.msg, { type: "success" });
      ToggleAddModal(data.data);
    } catch (err) {
      console.log(err);
      toast("خطایی رخ داد!", { type: "error" });
    }
  }

  useEffect(() => {
    if (activeView == "catalogue") {
      LoadCatalogue();
    }
  }, [activeView]);
  useEffect(() => {
    LoadCatalogue();
  }, [pageNum]);

  useEffect(() => {
    // query for data after 1500ms of of nut typeing in search field
    const delayDebounceFn = setTimeout(() => LoadCatalogue(), 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const onNewScanResult = (decodedText, decodedResult) => {
    // handle decoded results here
    console.log("decodedText", decodedText);
    console.log("decodedResult", decodedResult);
  };

  return (
    <>
      <div className={`container ${activeView ? "mt-3" : "min-vh-100"}`}>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                {activeView == "catalogue" ? (
                  <>
                    <div className="d-flex justify-content-end">
                      <div className="col pr-0 pt-0">
                        <input
                          type="text"
                          className="form-control form-control-lg search "
                          placeholder="جستجو با نام یا بارکد محصول"
                          autoComplete="off"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ height: "35px", borderRadius: "8px" }}
                        />
                      </div>
                      <button
                        className="btn btn-secondary"
                        style={{
                          paddingBottom: "2px",
                          paddingTop: "2px",
                          height: "30px",
                          alignSelf: "center",
                        }}
                        onClick={() => setActiveView()}
                      >
                        برگشت
                        <FontAwesomeIcon icon={faArrowLeft} className="pr-1" />
                      </button>
                    </div>
                    <div className="table-responsive mt-1">
                      <table
                        className="table text-center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <thead className="thead-light">
                          <tr className="align-items-center">
                            <th className="align-middle">تصویر</th>
                            <th className="align-middle">شناسه</th>
                            <th className="align-middle">نام</th>
                            <th className="align-middle">افزودن</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <TableRowSkeleton rows={10} cells={4} />
                          ) : (
                            catalogues?.map((item, index) => (
                              <SellerCatalogueTableItem
                                key={index}
                                product={item}
                                ToggleAddModal={ToggleAddModal}
                              ></SellerCatalogueTableItem>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {pageCount > 1 && (
                      <div className="row justify-content-center">
                        <Paginator
                          pageCount={pageCount}
                          setPageNum={setPageNum}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-center">
                      <h1 style={{ fontSize: "24px", color: "#535353" }}>
                        شیوه مورد نظر را انتخاب کنید
                      </h1>
                    </div>

                    <div className="d-flex mt-2 justify-content-center">
                      <Html5QrcodeScannerPlugin
                        fps={10}
                        SubmitBarcode={SubmitBarcode}
                      />
                    </div>
                    <div className="d-flex mt-2 justify-content-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => setActiveView("catalogue")}
                      >
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          className="pl-2"
                        />
                        جستجو در کاتالوگ
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SellerProductAddModal
        show={showAddModal}
        product={activeItem}
        ToggleAddModal={ToggleAddModal}
        LoadCatalogue={LoadCatalogue}
      ></SellerProductAddModal>
    </>
  );
};

Page.PageLayout = LayoutSeller;
export default Page;
/*
export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
*/

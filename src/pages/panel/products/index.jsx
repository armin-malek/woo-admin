import TableRowSkeleton from "../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parseDate, parseDateFull } from "../../../server/common/time";
import LayoutAdmin from "../../../components/LayoutAdmin";
import Paginator from "../../../components/Paginator";
import axios from "axios";
import ProductTableItem from "../../../components/panel/products/ProductTableItem";
import OrderEditModal from "../../../components/panel/orders/OrderEditModal";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    LoadProducts();
  }, []);

  useEffect(() => {
    LoadProducts();
  }, [pageNum]);
  useEffect(() => {
    // query for data after 1500ms of of nut typeing in search field
    const delayDebounceFn = setTimeout(() => LoadProducts(), 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  async function LoadProducts() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/panel/products/get", {
        params: { page: pageNum, search: searchTerm },
      });

      if (data.status != true) {
        toast(data.msg, { type: "error" });
        return;
      }

      setProducts(data.products);
      setIsLoading(false);
      setPageCount(data.pages);
    } catch (err) {
      console.log(err);
      toast("خطا در بارگذاری اطلاعات", { type: "error" });
    }
  }

  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <div className="col pr-0 pt-0">
              <input
                type="text"
                className="form-control form-control-lg search d-inline"
                placeholder="جستجو ..."
                autoComplete="off"
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  height: "35px",
                  borderRadius: "8px",
                  maxWidth: "250px",
                }}
              />
            </div>
          </div>
          <div className="card">
            <div
              className="table-responsive"
              style={
                {
                  //whiteSpace: "nowrap"
                }
              }
            >
              <table className="table text-center">
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">تصویر</th>
                    <th className="align-middle">نام</th>
                    <th className="align-middle">انبار</th>
                    <th className="align-middle">قیمت</th>
                    <th className="align-middle">دسته ها</th>
                    <th className="align-middle">تاریخ</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={7} />
                  ) : (
                    products?.map((product, index) => (
                      <ProductTableItem
                        key={index}
                        product={product}
                      ></ProductTableItem>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {pageCount > 1 && (
            <div className="row justify-content-center">
              <Paginator pageCount={pageCount} setPageNum={setPageNum} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Page.PageLayout = LayoutAdmin;

export default Page;
import TableRowSkeleton from "../../../../components/TableRowSkeleton";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { parseDateFull } from "../../../../server/common/time";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import AdminProductsTableItem from "../../../../components/cp/admin/products/AdminProductsTableItem";
import AdminProductEditModal from "../../../../components/cp/admin/products/AdminProductEditModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AdminProductAddModal from "../../../../components/cp/admin/products/AdminProductAddModal";
import axios from "axios";
import Paginator from "../../../../components/Paginator";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeProduct, setActiveProduct] = useState();
  const [rerender, setRerender] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [pageNum, setPageNum] = useState(1);

  function handleShowEdit(order) {
    setActiveProduct(order);
    setShowEditModal(true);
  }
  function handleCloseEdit() {
    setActiveProduct();
    setShowEditModal(false);
  }
  function handleShowAdd() {
    setShowAddModal(true);
  }
  function handleCloseAdd() {
    setShowAddModal(false);
  }

  useEffect(() => {
    LoadCats();
    LoadProducts();
  }, []);
  useEffect(() => {
    LoadCats();
    LoadProducts();
  }, [rerender, pageNum]);

  function doRerender() {
    setRerender(!rerender);
  }

  async function LoadCats() {
    try {
      setIsLoading(true);
      const fetchResp = await fetch("/api/shop/get-categories");
      const response = await fetchResp.json();

      if (response.status == false) {
        toast(response.msg, { type: "error" });
        return;
      }

      setCats(response.data);
    } catch (err) {
      console.log(err);
      toast("خطا در بارگذاری اطلاعات", { type: "error" });
    }
  }
  async function LoadProducts() {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/api/cp/admin/products/get-products", {
        params: { page: pageNum },
      });

      if (data.status == false) {
        toast(data.msg, { type: "error" });
        return;
      }

      data.products?.map((product) => {
        product.dateCreated = parseDateFull(product.dateCreated);
      });
      setProducts(data.products);
      setPageNum(data.pagination.pageNumber);
      setPageCount(data.pagination.pageCount);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast("خطا در بارگذاری اطلاعات", { type: "error" });
    }
  }
  return (
    <>
      <div className="row mt-3">
        <div className="col-12">
          <button
            className="btn btn-primary"
            style={{ borderRadius: "25px" }}
            onClick={handleShowAdd}
          >
            <FontAwesomeIcon
              icon={faPlus}
              style={{ height: "20px" }}
            ></FontAwesomeIcon>
            <span className="pr-1"> افزودن</span>
          </button>
          <div className="card mt-1">
            <div className="table-responsive">
              <table className="table text-center">
                <thead className="thead-light">
                  <tr className="">
                    <th className="align-middle">مشاهده</th>
                    <th className="align-middle">عنوان</th>
                    <th className="align-middle">بارکد</th>
                    <th className="align-middle">قیمت</th>
                    <th className="align-middle">مارکت</th>
                  </tr>
                </thead>
                <tbody className="table">
                  {isLoading ? (
                    <TableRowSkeleton rows={10} cells={5} />
                  ) : (
                    products.map((product, index) => (
                      <AdminProductsTableItem
                        key={index}
                        product={product}
                        handleView={handleShowEdit}
                      ></AdminProductsTableItem>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {pageCount > 0 && (
              <div className="row justify-content-center">
                <Paginator pageCount={pageCount} setPageNum={setPageNum} />
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminProductEditModal
        show={showEditModal}
        handleClose={handleCloseEdit}
        product={activeProduct}
        cats={cats}
        doRerender={doRerender}
      ></AdminProductEditModal>
      <AdminProductAddModal
        show={showAddModal}
        handleClose={handleCloseAdd}
        cats={cats}
        doRerender={doRerender}
      ></AdminProductAddModal>
    </>
  );
};

Page.PageLayout = LayoutAdmin;

export default Page;

import {
  faMoneyBills,
  faStar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import LayoutShop from "../../../components/LayoutShop";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: false,
    tooltip: {
      callbacks: {
        label: (item) => `${item.dataset.label}: ${item.formattedValue} تومان`,
      },
    },
  },
  tooltips: {
    mode: "index",
    intersect: true,
  },
  hover: {
    mode: "nearest",
    intersect: true,
  },
  scales: {
    xAxes: [
      {
        display: true,
        scaleLabel: {
          display: false,
          labelString: "ماه",
        },
      },
    ],
    yAxes: [
      {
        display: true,
        scaleLabel: {
          display: false,
          labelString: "مقدار",
        },
      },
    ],
  },
};

const Page = () => {
  const [data, setData] = useState();
  const [chartData, setChartData] = useState();
  // const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    async function getData() {
      try {
        // setIsLoaded(false);
        const fetchResp = await fetch("/api/shop/profile/get-profile");
        const resp = await fetchResp.json();

        if (resp.status != true) {
          toast(resp.msg, { type: "error" });
          return;
        }
        setData(resp.data);

        let chartDataTmp = {
          labels: [],
          datasets: [
            {
              label: "خرید",
              data: [],
              backgroundColor: "#FF0068",
              borderColor: "#FF0068",
              tension: 0.4,
            },
          ],
        };
        resp.data.chart?.reverse();
        resp.data.chart?.forEach((item) => {
          chartDataTmp.labels.push(item.monthName);
          chartDataTmp.datasets[0]?.data?.push(item.amount);
        });
        setChartData(chartDataTmp);
        //setIsLoaded(true);
      } catch (err) {
        // setIsLoaded(false);

        console.log(err);
      }
    }
    getData();
  }, []);

  return (
    <>
      <div className="card mb-4 border-0 shadow-sm"></div>
      <div className="row ">
        <div className="col-12 col-sm-12 col-md-6 col-lg-7 pl-3">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-auto align-self-center">
                  <span className="badge badge-primary p-2">
                    <FontAwesomeIcon icon={faWallet}></FontAwesomeIcon>
                  </span>
                </div>
                <div className="col pr-0">
                  <p className="text-secondary mb-0 small">خرید در ماه جاری</p>
                  <h6 className="text-dark my-0">
                    {data ? (
                      `${parseInt(
                        data?.lastAmount || 0
                      ).toLocaleString()} تومان`
                    ) : (
                      <Skeleton width={100}></Skeleton>
                    )}
                  </h6>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div>
                    {data ? (
                      <Line options={options} data={chartData} />
                    ) : (
                      <Skeleton height={258}></Skeleton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-12 col-md-6 col-lg-5">
          <div className="d-flex">
            <div className="card mb-3 border-0 shadow-sm  w-100">
              <div className="card-body">
                <div className="row">
                  <div className="col-auto align-self-center">
                    <span className="badge badge-success p-2">
                      <FontAwesomeIcon icon={faMoneyBills}></FontAwesomeIcon>
                    </span>
                  </div>
                  <div className="col pr-0">
                    <p className="text-secondary mb-0 small">خرید کل</p>
                    <h6 className="text-dark my-0">
                      {data ? (
                        `${parseInt(data?.totalAmount).toLocaleString()} تومان`
                      ) : (
                        <Skeleton width={100}></Skeleton>
                      )}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex">
            <div className="card mb-3 border-0 shadow-sm w-100">
              <div className="card-body">
                <div className="row">
                  <div className="col-auto align-self-center">
                    <span
                      className="badge badge-warning p-2"
                      style={{ color: "white" }}
                    >
                      <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                    </span>
                  </div>
                  <div className="col pr-0">
                    <p className="text-secondary mb-0 small">امتیاز کل</p>
                    <h6 className="text-dark my-0">
                      {data ? (
                        parseInt(data?.totalPoints).toLocaleString()
                      ) : (
                        <Skeleton width={100}></Skeleton>
                      )}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex">
            <div className="tab-content w-100" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-delivery"
                role="tabpanel"
                aria-labelledby="nav-delivery-tab"
              >
                <ul className="list-items">
                  <li>
                    <div className="row">
                      <div className="col">نام فروشگاه:</div>
                      <div className="col text-left">
                        {data ? (
                          <>{data?.user.Market.name}</>
                        ) : (
                          <Skeleton width={100}></Skeleton>
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col">فروشنده:</div>
                      <div className="col text-left">
                        {data ? (
                          <>{data?.user.fullName}</>
                        ) : (
                          <Skeleton width={100}></Skeleton>
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col">شماره تماس:</div>
                      <div className="col text-left">
                        {data ? (
                          <>{data?.user.mobile}</>
                        ) : (
                          <Skeleton width={100}></Skeleton>
                        )}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col">آدرس فروشگاه:</div>
                      <div className="col text-left">
                        {data ? (
                          <>{data?.user.Market.marketAddress.address}</>
                        ) : (
                          <Skeleton width={100}></Skeleton>
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Page.PageLayout = LayoutShop;
export default Page;

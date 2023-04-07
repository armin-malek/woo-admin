import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../../context/CartContex";
import { CalcOrderPoints } from "../../../server/common/functions";

export default function CartSteps({ totalPoints, setTotalPoints }) {
  const cart = useContext(CartContext);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    console.log("cost change");
    let newTotalCost = cart.getTotalCost();
    setTotalCost(newTotalCost);

    /*
    let points = 0;
    if (newTotalCost >= 3000000) points += 10;
    if (newTotalCost >= 5000000) points += 5;
    if (newTotalCost >= 7000000) points += 5;
    if (newTotalCost >= 10000000) points += 10;

    if (cart.items.length >= 3) points += 5;
    if (cart.items.length >= 5) points += 5;
    if (cart.items.length >= 7) points += 5;
*/
    setTotalPoints(CalcOrderPoints(newTotalCost, cart.items.length));
  }, [cart.items]);

  return (
    <>
      <div dir="ltr" className="container">
        <ul className="steps">
          <li
            className={`step ${
              totalCost >= 2000000 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 2 میلیون</p>
            <span className="step__icon" />
            {totalCost >= 2000000 ? (
              <span dir="rtl" className="step__label">
                10 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
          <li
            className={`step ${
              totalCost >= 5000000 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 5 میلیون</p>
            <span className="step__icon" />
            {totalCost >= 5000000 ? (
              <span dir="rtl" className="step__label">
                5 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
          <li
            className={`step ${
              totalCost >= 7000000 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 7 میلیون</p>
            <span className="step__icon" />
            {totalCost >= 7000000 ? (
              <span dir="rtl" className="step__label">
                5 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
          <li
            className={`step ${
              totalCost >= 10000000 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 10 میلیون</p>
            <span className="step__icon" />
            {totalCost >= 10000000 ? (
              <span dir="rtl" className="step__label">
                10 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
        </ul>
      </div>

      <br />
      <div dir="ltr" className="container">
        <ul className="steps">
          <li
            className={`step ${
              cart.items.length >= 3 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 3 ردیف </p>
            <span className="step__icon" />
            {cart.items.length >= 3 ? (
              <span dir="rtl" className="step__label">
                5 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
          <li
            className={`step ${
              cart.items.length >= 5 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 5 ردیف </p>
            <span className="step__icon" />
            {cart.items.length >= 5 ? (
              <span dir="rtl" className="step__label">
                5 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
          <li
            className={`step ${
              cart.items.length >= 7 ? "step--complete step--active" : ""
            }`}
          >
            <p dir="rtl"> 7 ردیف</p>
            <span className="step__icon" />
            {cart.items.length >= 7 ? (
              <span dir="rtl" className="step__label">
                5 امتیاز
              </span>
            ) : (
              ""
            )}
          </li>
        </ul>
      </div>
      <style jsx>
        {`
          @charset "UTF-8";
          /* Mixins */
          /* Color Variables */
          /* Theme Variables */
          /* Animations */
          @-webkit-keyframes bounce {
            0% {
              transform: scale(1);
            }
            33% {
              transform: scale(0.9);
            }
            66% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          @keyframes bounce {
            0% {
              transform: scale(1);
            }
            33% {
              transform: scale(0.9);
            }
            66% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          /* Base Styles */

          /* Component Styles - Steps */
          .steps {
            display: flex;
            width: 100%;
            margin: 0;
            padding: 0 0 2rem 0;
            list-style: none;
          }

          .step {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            flex: 1;
            position: relative;
            pointer-events: none;
          }
          .step--active,
          .step--complete {
            cursor: pointer;
            pointer-events: all;
          }
          .step:not(:last-child):before,
          .step:not(:last-child):after {
            display: block;
            position: absolute;
            top: 70%;
            left: 50%;
            height: 0.25rem;
            content: "";
            transform: translateY(-50%);
            will-change: width;
            z-index: -1;
          }
          .step:before {
            width: 100%;
            background-color: #e6e7e8;
          }
          .step:after {
            width: 0;
            background-color: #791ed3;
          }
          .step--complete:after {
            width: 100% !important;
            opacity: 1;
            transition: width 0.6s ease-in-out, opacity 0.6s ease-in-out;
          }

          .step__icon {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 3rem;
            height: 3rem;
            background-color: #585757;
            border: 0.25rem solid #e6e7e8;
            border-radius: 50%;
            color: transparent;
            font-size: 2rem;
          }
          .step__icon:before {
            display: block;
            color: #fff;
            content: "✓";
          }
          .step--complete.step--active .step__icon {
            color: #fff;
            transition: background-color 0.3s ease-in-out,
              border-color 0.3s ease-in-out, color 0.3s ease-in-out;
          }
          .step--incomplete.step--active .step__icon {
            border-color: #791ed3;
            transition-delay: 0.5s;
          }
          .step--complete .step__icon {
            -webkit-animation: bounce 0.5s ease-in-out;
            animation: bounce 0.5s ease-in-out;
            background-color: #791ed3;
            border-color: #791ed3;
            color: #fff;
          }

          .step__label {
            position: absolute;
            bottom: -2rem;
            left: 50%;
            margin-top: 1rem;
            font-size: 0.8rem;
            text-transform: uppercase;
            transform: translateX(-50%);
          }
          .step--incomplete.step--inactive .step__label {
            color: #e6e7e8;
          }
          .step--incomplete.step--active .step__label {
            color: #fff;
          }
          .step--active .step__label {
            transition: color 0.3s ease-in-out;
            transition-delay: 0.5s;
          }
        `}
      </style>
    </>
  );
}

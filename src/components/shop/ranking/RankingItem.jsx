import { useEffect, useState } from "react";

export default function RankingItem({ rank, name, points }) {
  const [type, setType] = useState();

  useEffect(() => {
    switch (rank) {
      case 1:
        setType("goldstar");
        break;
      case 2:
        setType("silverstar");
        break;
      case 3:
        setType("bronzestar");
        break;
      default:
        if (rank) setType("rhodiumstar");
        break;
    }
  }, []);
  return (
    <>
      <ul className="guiz-awards-row">
        <li className="guiz-awards-star">
          <span className={`star ${type}`}>
            <h1 className="text-center">{rank}</h1>
          </span>
        </li>
        <li className="guiz-awards-title">{name}</li>
        <li className="guiz-awards-time">{points} امتیاز</li>
      </ul>
      <style jsx>
        {`
          .quiz-window {
            position: absolute;
            left: 0;
            right: 0;
            top: 100px;
            bottom: 100px;
            margin: auto;
            width: 95%;
            border-radius: 4px;
            background: #fff;

            overflow: auto;
          }
          .quiz-window-header {
            padding: 20px 15px;
            text-align: center;
            position: relative;
          }
          .quiz-window-title {
            font-size: 26px;
          }

          .quiz-window-body {
            background-color: #f9f9f9;
          }
          .guiz-awards-row {
            margin: 0;
            padding: 10px 40px;
            list-style: none;
          }
          .guiz-awards-row:after {
            content: "";
            display: table;
            clear: both;
          }
          .guiz-awards-row:nth-child(odd) {
            background-color: #f4f5f5;
          }
          .guiz-awards-row li {
            display: inline-block;
            vertical-align: top;
            float: right;
          }
          .guiz-awards-header {
            text-align: center;
            padding: 20px 40px;
          }
          .guiz-awards-star,
          .guiz-awards-track,
          .guiz-awards-time,
          .guiz-awards-header-star,
          .guiz-awards-header-track {
            min-width: 54px;
            text-align: center;
            width: 16%;
          }
          .guiz-awards-title {
            width: 43%;
            min-width: 160px;
            font-size: 18px;
            font-weight: normal;
            padding-top: 3px;
          }
          .guiz-awards-header-title {
            width: 43%;
            min-width: 160px;
          }
          .guiz-awards-subtitle {
            color: #858585;
            font-size: 14px;
            font-weight: 300;
          }
          .guiz-awards-track,
          .guiz-awards-time {
            width: 22%;
            min-width: 80px;
            font-size: 18px;
            line-height: 30px;
          }
          .guiz-awards-header-track,
          .guiz-awards-header-time {
            width: 54%;
            min-width: 80px;
          }
          .guiz-awards-track .null,
          .guiz-awards-time .null {
            color: #bababa;
          }
          .star {
            display: block;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #bdc2c1;
            background: #d6d6d6;
          }
          .goldstar {
            border-color: #d19703;
            background: #daa520;
            color: black;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          }
          .silverstar {
            border-color: #808080;
            background: #c0c0c0;
            color: black;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          }
          .bronzestar {
            border-color: #af5903;
            background: #cd7f32;
            color: black;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          }
          .rhodiumstar {
            border-color: #93c3ca;
            background: #9dc9cf;

            color: black;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          }
          .platinumstar {
            border-color: #628bb1;
            background: #7c98b3;
            color: black;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          }
          .star {
            color: black;
            font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
              "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
          }

          .guiz-awards-buttons {
            background: #fff;
            text-align: center;
            padding: 20px 0;
          }
          .guiz-awards-but-back {
            display: inline-block;
            background: none;
            border: 1px solid #61a3e5;
            border-radius: 21px;
            padding: 7px 40px 7px 20px;
            color: #61a3e5;
            font-size: 17px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .guiz-awards-but-back:hover {
            background: #61a3e5;
            color: #fff;
          }

          .guiz-awards-but-back i {
            font-size: 26px;
            line-height: 17px;
            margin-right: 20px;
            position: relative;
            top: 2px;
          }
        `}
      </style>
    </>
  );
}

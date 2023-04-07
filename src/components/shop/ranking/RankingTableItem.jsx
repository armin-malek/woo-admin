import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function RankingTableItem({ market }) {
  const [bgColor, setBgColor] = useState("white");
  useEffect(() => {
    switch (market.position) {
      case 1:
        setBgColor("linear-gradient(270deg, #ffeb79 38.47%, #ffd94a 50%)");
        break;
      case 2:
        setBgColor("linear-gradient(270deg, #dedfd0 36.35%, #d7d8c8 50%)");
        break;
      case 3:
        setBgColor("linear-gradient(270deg, #f4b27b 40.31%, #f4b27b 50%)");
        break;
      default:
        if (market.isYou == true) {
          setBgColor("#30ade5");
          break;
        }
        setBgColor("white");
        break;
    }
  }, []);
  return (
    <>
      <tr
        style={{
          background: bgColor,
          fontWeight: market.isYou == true ? "bold" : "normal",
        }}
      >
        <td className="align-middle">{market.position}</td>
        <td className="align-middle">
          {market.name} {market.isYou == true ? "(شما)" : ""}
        </td>
        <td className="align-middle">{market.totalPoints} امیتاز</td>
      </tr>
      <style jsx>{`
        td {
        }
        .b-shadow {
          -webkit-box-shadow: 0px 0px 15px 0px rgba(191, 191, 191, 1);
          -moz-box-shadow: 0px 0px 15px 0px rgba(191, 191, 191, 1);
          box-shadow: 0px 0px 15px 0px rgba(191, 191, 191, 1);
        }
      `}</style>
    </>
  );
}

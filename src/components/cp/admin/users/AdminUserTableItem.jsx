import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminUserTableItem({ user, handleView }) {
  return (
    <>
      <tr>
        <td className="align-middle">
          <button className="btn" onClick={() => handleView(user)}>
            <FontAwesomeIcon
              style={{
                height: "25px",
                color: "#0081C9",
              }}
              icon={faEye}
            ></FontAwesomeIcon>
          </button>
        </td>
        <td className="align-middle">{user.fullName}</td>
        <td className="align-middle">{user.mobile}</td>
        <td className="align-middle" dir="ltr">
          {user.lastLogin}
        </td>
        <td className="align-middle" dir="ltr">
          {user.dateRegister}
        </td>
        <td className="align-middle">{user.Customer._count.CustomerMarkets}</td>
        <td className="align-middle">{user.Customer._count.Orders}</td>
      </tr>
      <style jsx>{`
        td {
          padding-top: 4px;
          padding-bottom: 4px;
        }
      `}</style>
    </>
  );
}

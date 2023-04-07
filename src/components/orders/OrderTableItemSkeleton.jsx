import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrderTableItemSkeleton() {
  return (
    <tr>
      <td style={{ width: "200px" }}>
        <Skeleton></Skeleton>
      </td>
      <td>
        <Skeleton></Skeleton>
      </td>
      <td>
        <Skeleton></Skeleton>
      </td>
      <td>
        <Skeleton></Skeleton>
      </td>
      <td>
        <Skeleton></Skeleton>
      </td>
      <td>
        <Skeleton></Skeleton>
      </td>
      <td>
        <Skeleton></Skeleton>
      </td>
    </tr>
  );
}

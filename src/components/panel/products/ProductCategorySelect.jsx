import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";
import { useState, useEffect } from "react";

export default function ProductCategorySelect({
  cats,
  selectedCats,
  checkedList,
}) {
  const [data, setData] = useState();

  const onCatChange = (currentNode, selectedNodes) => {
    // console.log("currentNode", currentNode);
    // console.log("selecteds", selectedNodes);

    const selectedIDs = selectedNodes.map((x) => x.catid);
    // console.log("selectedIDs", selectedIDs);
    selectedCats.current = selectedIDs;
    // console.log("done");
  };

  useEffect(() => {
    if (!cats || cats.length < 1) return;
    let newData = [];
    let parents = cats.filter((x) => x.parent == 0);
    parents.map((parent) => {
      let tmp = {
        catid: parent.id,
        label: parent.name,
        children: [],
        checked: checkedList?.includes(parent.id),
      };
      let children = cats.filter((x) => x.parent == parent.id);
      children?.map((item) => {
        tmp.children.push({
          catid: item.id,
          label: item.name,
          children: [],
          checked: checkedList?.includes(item.id),
        });
      });
      newData.push(tmp);
    });
    setData(newData);
  }, [cats, checkedList]);

  // useEffect(() => {
  //   console.log("data", data);
  // }, [data]);

  return (
    <>
      {data && (
        <DropdownTreeSelect
          data={data}
          onChange={onCatChange}
          mode="hierarchical"
          className="bootstrap-demo"
          texts={{ placeholder: "جستجو ..." }}
        />
      )}

      <style jsx="true">{`
        /* bootstrap-demo is a custom classname to increases the specificity of our styles. It can be anything. 
       * The idea is that it is easy to extend/override builtin styles with very little effort.
       */
      `}</style>
    </>
  );
}

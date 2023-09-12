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
    cats = createDataTree(cats);
    //console.log(cats);
    setData(cats);
  }, [cats, checkedList]);

  const createDataTree = (dataset) => {
    const hashTable = Object.create(null);
    dataset.forEach(
      (aData) =>
        (hashTable[aData.id] = {
          parent: aData.parent,
          catid: aData.id,
          label: aData.name,
          children: [],
          checked: checkedList?.includes(aData.id),
        })
    );
    console.log("hashTable", hashTable);

    const dataTree = [];
    dataset.forEach((aData) => {
      if (aData.parent) {
        console.log("last", aData.parent);
        hashTable[aData.parent].children.push(hashTable[aData.id]);
      } else dataTree.push(hashTable[aData.id]);
    });
    return dataTree;
  };
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

import woo from "../../server/common/woocommerce";

const handler = async (req, res) => {
  try {
    let { data } = await woo.get("products/categories", { per_page: 100 });
    // data = data.filter((x) => x.parent == 0);
    data = data.sort((a, b) => a.parent - b.parent);
    //data.map((item) => (item.children = []));
    let cats = [];

    data.forEach((element) => {
      if (element.parent == 0) {
        cats.push(element);
      }
    });
    // parents.map((parent) => );
    res.send({
      cats: list_to_tree(data),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("خطایی رخ داد.");
  }
};

function list_to_tree(list) {
  var map = {},
    node,
    roots = [],
    i;

  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parent != 0) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parent]]?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export default handler;

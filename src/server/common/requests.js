export function LimitHttpMethode(req, res, allowed) {
  if (!Array.isArray(allowed)) {
    if (typeof allowed == "string") {
      allowed = [allowed];
    } else {
      throw Error("allowed must be of type string or Array<string>");
    }
  }
  if (!allowed.includes(req.method)) {
    res.status(405).send(`methode not allowed`);
    return;
  }
}

export function handlePagination(pageNum, totalCount, perPage) {
  pageNum = parseInt(pageNum);
  totalCount = parseInt(totalCount);
  perPage = parseInt(perPage);
  if (!pageNum || pageNum < 1) pageNum = 1;
  if (!totalCount || totalCount < 1) totalCount = 1;
  if (!perPage || perPage < 1) perPage = 10;

  const pageCount = Math.ceil(totalCount / perPage);

  if (pageNum > pageCount) pageNum = pageCount;

  return {
    skip: (pageNum - 1) * perPage,
    take: perPage,
    pagination: { pageNumber: pageNum, pageCount },
  };
}

export const isValidJson = (str: string): boolean => {
  if (parseInt(str)) {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    console.log(e)
    return false;
  }
}

export type SortField = "blockNumber" | "section" | "method"
export const convertStringToSortField = (str: string | undefined): SortField => {
  if (str === "section") return "section";
  if (str === "method") return "method";
  return "blockNumber";
}

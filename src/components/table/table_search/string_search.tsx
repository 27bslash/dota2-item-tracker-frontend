import DotaMatch from "../../types/matchData";

const stringSearch = (
  data: DotaMatch[],
  property: keyof DotaMatch,
  value: string
) => {
  if (!data.length) return [];
  const m = [...data].filter((x) => {
    // console.log(x[property], value)
    return String(x[property]).toLowerCase() === value.toLowerCase();
  });
  return m;
};
export default stringSearch;

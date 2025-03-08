import { Order } from "../components/table";

export const stringSorter = (a: string, b: string, order: Order) => {
  switch (order) {
    case "asc":
      return a.localeCompare(b);
    case "desc":
      return b.localeCompare(a);
  }
  return 0;
};

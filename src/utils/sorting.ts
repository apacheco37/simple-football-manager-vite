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

export const numberSorter = (a: number, b: number, order: Order) => {
  switch (order) {
    case "asc":
      return a - b;
    case "desc":
      return b - a;
  }
  return 0;
};

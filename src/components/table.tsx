import {
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table as MaterialTable,
  Button,
  TableSortLabel,
  styled,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import React from "react";

export type Column<T> =
  | {
      key: keyof T;
      label: string;
      sortable?: boolean;
      sorter?: (a: T, b: T, order: Order) => number;
    }
  | {
      render: (row: T, rowIndex: number) => React.ReactNode;
      label: string;
      sortable?: boolean;
      sorter?: (a: T, b: T, order: Order) => number;
    };

export type Order = "asc" | "desc" | undefined;

const Table = <T extends { id?: number | string }>({
  columns,
  rows,
  basePath,
  cellStyle,
}: {
  columns: Column<T>[];
  rows: T[];
  basePath?: string;
  cellStyle?: (row: T) => React.CSSProperties;
}) => {
  const [order, setOrder] = React.useState<Order>();
  const [orderBy, setOrderBy] = React.useState<number | undefined>();

  const theme = useTheme();

  const handleSort = (columnIndex: number) => {
    setOrderBy(columnIndex);
    switch (order) {
      case "asc":
        setOrder("desc");
        break;
      case "desc":
        setOrder(undefined);
        break;
      default:
        setOrder("asc");
    }
  };

  const orderedRows = React.useMemo(() => {
    if (orderBy === undefined) {
      return rows;
    }
    const sorter = columns[orderBy].sorter;
    if (!sorter) {
      return rows;
    }
    return rows.slice().sort((a, b) => sorter(a, b, order));
  }, [columns, order, orderBy, rows]);

  return (
    <TableContainer component={Paper}>
      <MaterialTable size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.common.black }}>
            {columns.map(({ label, sortable }, columnIndex) => (
              <TableCell
                key={label}
                sortDirection={orderBy === columnIndex ? order : false}
              >
                {sortable ? (
                  <TableSortLabel
                    active={orderBy === columnIndex && order !== undefined}
                    direction={orderBy === columnIndex ? order : "asc"}
                    onClick={
                      sortable ? () => handleSort(columnIndex) : undefined
                    }
                  >
                    {label}
                  </TableSortLabel>
                ) : (
                  label
                )}
              </TableCell>
            ))}
            {basePath && <TableCell key={"details"}>{"See Details"}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {orderedRows.map((row, rowIndex) => (
            <StyledTableRow
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                fontWeight: "bold",
              }}
            >
              {columns.map((column) =>
                "key" in column ? (
                  <TableCell key={String(column.key)} sx={cellStyle?.(row)}>
                    {String(row[column.key])}
                  </TableCell>
                ) : (
                  <TableCell
                    key={`${column.label}-${rowIndex}`}
                    sx={cellStyle?.(row)}
                  >
                    {column.render(row, rowIndex)}
                  </TableCell>
                )
              )}
              {basePath && (
                <TableCell>
                  <Button
                    component={Link}
                    to={`${basePath}/${row.id}`}
                    sx={{ minWidth: 0 }}
                  >
                    <VisibilityIcon />
                  </Button>
                </TableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </MaterialTable>
    </TableContainer>
  );
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default Table;

import {
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table as MaterialTable,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import React from "react";

export type Column<T> =
  | { key: keyof T; label: string }
  | { render: (row: T, rowIndex: number) => React.ReactNode; label: string };

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
  return (
    <TableContainer component={Paper}>
      <MaterialTable size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map(({ label }) => (
              <TableCell key={label}>{label}</TableCell>
            ))}
            {basePath && <TableCell key={"details"}>{"See Details"}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
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
            </TableRow>
          ))}
        </TableBody>
      </MaterialTable>
    </TableContainer>
  );
};

export default Table;

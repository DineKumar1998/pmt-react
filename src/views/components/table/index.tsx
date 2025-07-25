import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { SortIcon } from "../icons";
import BackArrow from "../icons/BackArrow";
import "./table.scss";
import { TableHeaderWrapper } from "./TableHeaderWrapper";

// Define a base type that requires an 'id' property
interface WithId {
  id: string | number;
}

// Define props for the CommonTable component
interface CommonTableProps<T extends WithId> {
  columns: ColumnDef<T>[];
  data: T[];
  itemsPerPage?: number;
  total_rms?: number;
  hasNextPage?: boolean;
  onPageChange?: (pageIndex: number) => void;
  onRowClick?: (id: number) => void;
  customColumnWidth?: boolean;
  enableTableScroll?: boolean;
  isRowClickable?: boolean;
}

function Table<T extends WithId>({
  columns,
  data,
  itemsPerPage,
  total_rms,
  hasNextPage,
  onPageChange,
  onRowClick,
  customColumnWidth,
  enableTableScroll,
  isRowClickable
}: CommonTableProps<T>) {
  const [sorting, setSorting] = React.useState<import("@tanstack/react-table").SortingState>([]);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: itemsPerPage || 10,
  });

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: false,
    pageCount: Math.ceil((total_rms ?? 0) / pagination.pageSize),
  });

  React.useEffect(() => {
    if (onPageChange) {
      onPageChange(pagination.pageIndex + 1);
      console.log("Current Page:", pagination.pageIndex + 1);
    }
  }, [pagination.pageIndex]);

  return (
    <div className="table-container">
      {/* Table Container */}
      <div className={`table${enableTableScroll ? " table-scroll" : ""}`}>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getIsSorted() ? "sorted" : ""}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : undefined,
                      ...(customColumnWidth
                        ? {
                          width: header.getSize(),
                          minWidth: header.getSize(),
                          maxWidth: header.getSize(),
                        }
                        : {})
                    }}
                  >
                    <TableHeaderWrapper children={flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )} />
                    {header.column.getIsSorted() ? <SortIcon /> : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row.original.id as number);
                      }
                    }}
                    style={isRowClickable ? { cursor: "pointer" } : {}}
                  >
                    {row.getVisibleCells().map((cell) => {
                      // Remove the console.log and ensure cell rendering
                      const renderedCell = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      );

                      return (
                        <td
                          key={cell.id}
                          className="table-cell"
                        >
                          {renderedCell !== null &&
                            renderedCell !== undefined &&
                            renderedCell !== "" ? (
                            renderedCell
                          ) : (
                            <span className="empty-cell">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {total_rms && (total_rms > (itemsPerPage ?? 10))
        ? (
          <div className="pagination-container">
            <div className="pagination">
              <button
                onClick={() => {
                  table.previousPage();
                }}
                disabled={!table.getCanPreviousPage()}
                className="pagination-button"
              >
                <BackArrow />
              </button>
              <span className="pagination-pages">
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      table.setPageIndex(i);
                    }}
                    className={`pagination-page-number${table.getState().pagination.pageIndex === i ? " active" : ""}`}
                    disabled={table.getState().pagination.pageIndex === i}
                  >
                    {i + 1}
                  </button>
                ))}
              </span>
              <button
                onClick={() => {
                  table.nextPage();
                }}
                disabled={!hasNextPage}
                className="pagination-button"
              >
                <BackArrow />
              </button>
            </div>
          </div>
        )
        : null
      }
    </div>
  );
}

export default Table;

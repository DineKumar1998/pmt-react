import ClockIcon from "@/views/components/icons/table/Clock";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

// Example: A different table for clients
interface Client {
  id: number;
  name: string;
  age: number;
}

const data = [
  { name: "John", age: 30, id: 1 },
  { name: "Jane", age: 28, id: 2 },
];

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <ClockIcon /> Name
      </div>
    ),
    cell: ({ row }) => (
      <Link to={`/client-list/edit-client/${row.original.id}`}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const ClientListPage: React.FC = () => {
  return (
    <div className="client-list-page">
      <div className="buttons">
        <SearchComponent placeholder="Search..." />
      </div>
      <Table<Client> columns={columns} data={data} total_rms={data.length} />
    </div>
  );
};

export default ClientListPage;

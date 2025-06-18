import ClockIcon from "@/views/components/icons/table/Clock";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";

interface Client {
  id: number;
  name: string;
  age: number;
}

const data = [
  { name: "John", age: 30, id: 1 },
  { name: "Jane", age: 28, id: 2 },
];

const columns: ColumnDef<(typeof data)[0]>[] = [
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
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const RecentClient: React.FC = () => {
  return (
    <div className="relationship-manager-page">
      <h2 className="section-title">Recent Activity</h2>
      <Table<Client> columns={columns} data={data} />
    </div>
  );
};

export default RecentClient;

import ClockIcon from "@/views/components/icons/table/Clock";
import TrendingIcon from "@/views/components/icons/table/Trending";
import UserIcon from "@/views/components/icons/table/User";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import ActionIcon from "@/views/components/icons/table/Action";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import BagIcon from "@/views/components/icons/table/Bag";
import EditIcon from "@/views/components/icons/Edit";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { getClientList } from '@/apis/client';
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import "./index.scss";
import { useNavigate } from "react-router-dom";

type Client = {
  id: number;
  client_name: string;
  industry_name: string | null;
  address: string | null;
  assigned_date: string | null;
  rm_name: string | null;
  project_count: number | null;
};

const ClientListPage: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const itemsPerPage = 10;
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    search: "",
  });
  const navigate = useNavigate();


  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ProfileWithOptionsIcon /> {t.table.id}
        </div>
      ),
    },
    {
      accessorKey: "client_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.name}
        </div>
      ),
    },
    {
      accessorKey: "industry_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <BagIcon /> {t.table.industry}
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocationIcon /> {t.table.address}
        </div>
      ),
    },
    {
      accessorKey: "assigned_date",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ClockIcon /> {t.table.assignDate}
        </div>
      ),
    },
    {
      accessorKey: "rm_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.rmAssigned}
        </div>
      ),
    },
    {
      accessorKey: "project_count",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <TrendingIcon /> {t.table.projects}
        </div>
      ),
    },
    {
      id: "action",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ActionIcon /> {t.table.action}
        </div>
      ),
      cell: () => (
        <EditIcon width={18} height={18} />
      ),
    },
  ];

  const handlePageChange = (pageIndex: number) => {
    console.log("Page changed to:", pageIndex);
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
  };


  const handleRowClick = (id: number) => {
    console.log("handleRowClick:", id);
    navigate(
      `/client-list/edit-client/${id}`,
    )
  };

  const { data: clientList } = useQuery({
    queryKey: ['clientList', queryParams, selectedLang],
    queryFn: () =>
      getClientList({ ...queryParams, language: selectedLang }),
  });

  const total_clients = clientList?.totalCount ?? 0;

  let updatedClientList: Client[] = [];
  if (clientList?.data?.length) {
    updatedClientList = clientList.data.map(
      ({
        rm_first_name,
        rm_last_name,
        assigned_date,
        ...rest
      }: {
        rm_first_name: string;
        rm_last_name?: string | null;
        assigned_date: string | null;
        [key: string]: any;
      }) => ({
        ...rest,
        rm_name: `${rm_first_name} ${(rm_last_name ?? '').trim()}`.trim(),
        assigned_date: assigned_date
          ? new Date(assigned_date).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          : null
      })
    );
  }
  return (
    <div className="client-list-page">
      <div className="buttons">
        <SearchComponent placeholder="Search..." />
      </div>
      <Table
        columns={columns}
        data={updatedClientList}
        itemsPerPage={itemsPerPage}
        total_rms={total_clients}
        hasNextPage={clientList?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ClientListPage;

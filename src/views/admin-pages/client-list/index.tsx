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
import { useNavigate } from "react-router-dom";
import "./index.scss";

type Client = {
  id: number;
  client_name: string;
  industry_name: string | null;
  address: string | null;
  assigned_date: string | null;
  rm_name: string | null;
  project_count: number | null;
  primary_percentage: number;
  secondary_percentage: number;
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

  const ProgressBar = ({ value, isPrimary }: { value: number; isPrimary?: boolean }) => (
    <div
      className="progress-bar"
    >
      <div
        className={`progress-bar-fill ${isPrimary ? "primary-fill" : "secondary-fill"}`}
        style={{
          width: `${value}%`,
        }} />
    </div>
  );


  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ProfileWithOptionsIcon /> {t.table.id}
        </div>
      ),
      cell: ({ row }: any) => {
        const { id } = row.original;
        return <div
          onClick={() => openEditClientPage(id)}
          style={{ cursor: "pointer" }}
        >
          {id}
        </div>;
      },
      size: 40
    },
    {
      accessorKey: "client_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.name}
        </div>
      ),
      cell: ({ row }: any) => {
        const { id, client_name } = row.original;
        return <div
          onClick={() => openEditClientPage(id)}
          style={{ cursor: "pointer" }}
        >
          {client_name}
        </div>;
      },
      size: 120
    },
    {
      accessorKey: "industry_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <BagIcon /> {t.table.industry}
        </div>
      ),
      size: 120
    },
    {
      id: "status",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocationIcon /> {t.formLabel.status}
        </div>
      ),
      cell: ({ row }) => {
        const { primary_percentage, secondary_percentage } = row.original;
        return (
          <div className="progress-bar-wrapper">
            <div className="progress-bar-container">
              <span>P</span>
              <ProgressBar value={primary_percentage} isPrimary={true} />
              <span>{primary_percentage}%</span>
            </div>

            <div className="progress-bar-container">
              <span>S</span>
              <ProgressBar value={secondary_percentage} />
              <span>{secondary_percentage}%</span>
            </div>
          </div>
        );
      },
      size: 250
    },
    {
      accessorKey: "address",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocationIcon /> {t.table.address}
        </div>
      ),
      size: 120
    },
    {
      accessorKey: "assigned_date",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ClockIcon /> {t.table.assignDate}
        </div>
      ),
      size: 120
    },
    {
      accessorKey: "rm_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.rmAssigned}
        </div>
      ),
      size: 120
    },
    {
      accessorKey: "project_count",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <TrendingIcon /> {t.table.projects}
        </div>
      ),
      cell: ({ row }: any) => {
        const { id, project_count, client_name } = row.original;
        return <div
          onClick={() => openClientProjectsPage(id, client_name)}
          style={{ cursor: "pointer", textAlign: "center", width: "50%" }}
        >
          {project_count}
        </div>;
      },
      size: 80
    },
    {
      id: "action",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ActionIcon /> {t.table.action}
        </div>
      ),
      cell: ({ row }: any) => {
        const { id, client_name } = row.original;
        return <div style={{ display: "flex", justifyContent: "center", width: "50%" }}>
          <EditIcon
            width={18}
            height={18}
            style={{ cursor: "pointer" }}
            onClick={() => openManageClientParametersPage(id, client_name)}
          />
        </div>;
      },
      size: 80
    },
  ];

  const handlePageChange = (pageIndex: number) => {
    console.log("Page changed to:", pageIndex);
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
  };


  const openEditClientPage = (id: number) => {
    console.log("openEditClientPage:", id);
    navigate(
      `/client-list/edit-client/${id}`,
    )
  };

  const openClientProjectsPage = (id: number, name: string) => {
    navigate(
      `/client-list/projects?clientId=${id}&clientName=${name}`,
    )
  };

  const openManageClientParametersPage = (id: number, clientName: string) => {
    navigate(`/manage-parameters/client?clientId=${id}&clientName=${clientName}`)
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
        stats,
        ...rest
      }: {
        rm_first_name: string;
        rm_last_name?: string | null;
        assigned_date: string | null;
        stats: any | null;
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
          : null,
        primary_percentage: stats?.[0]?.primaryPercentage ?? 0,
        secondary_percentage: stats?.[0]?.secondaryPercentage ?? 0,
      })
    );
  }
  return (
    <div className="client-list-page">
      <div className="buttons">
        <SearchComponent
          placeholder={`${t.buttons.search}...`}
          onSearch={(value) => {
            setQueryParams((prev) => ({
              ...prev,
              page: 1,
              search: value ?? "",
            }));
          }}
        />
      </div>
      <Table
        columns={columns}
        data={updatedClientList}
        itemsPerPage={itemsPerPage}
        total_rms={total_clients}
        hasNextPage={clientList?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        customColumnWidth={true}
        enableTableScroll={true}
      />
    </div>
  );
};

export default ClientListPage;

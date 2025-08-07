import ClockIcon from "@/views/components/icons/table/Clock";
import TrendingIcon from "@/views/components/icons/table/Trending";
import UserIcon from "@/views/components/icons/table/User";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import ActionIcon from "@/views/components/icons/table/Action";
import BagIcon from "@/views/components/icons/table/Bag";
import EditIcon from "@/views/components/icons/Edit";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { NavLink } from "react-router-dom";
import { getRMClientList } from "@/apis/rm-portal/client";
import "./index.scss";
import { useBreadcrumbs } from "@/context/Breadcrumb";

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
  const {addBreadcrumb} = useBreadcrumbs()

  const ProgressBar = ({
    value,
    isPrimary,
  }: {
    value: number;
    isPrimary?: boolean;
  }) => (
    <div className="progress-bar">
      <div
        className={`progress-bar-fill ${isPrimary ? "primary-fill" : "secondary-fill"
          }`}
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );

  const columns: any = () =>
    [
      {
        accessorKey: "client_name",
        header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UserIcon /> {t.table.name}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "industry_name",
        header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <BagIcon /> {t.table.industry}
          </div>
        ),
        size: 120,
      },
      {
        id: "status",
        header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LocationIcon /> {t.formLabel.status}
          </div>
        ),
        cell: ({ row }: any) => {
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
        size: 250,
      },
      {
        accessorKey: "address",
        header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <LocationIcon /> {t.table.address}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "assigned_date",
        header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <ClockIcon /> {t.table.assignDate}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "rm_name",
        header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UserIcon /> {t.table.rmAssigned}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "project_count",
        header: () => (
          <>
            <TrendingIcon /> <span className="title">{t.table.projects}</span>
          </>
        ),
        cell: ({ row }: any) => {
          const { project_count, id, client_name } = row.original;
          return <NavLink to={`/members-list/${client_name}?memberId=${id}`} className={'text-underline'}
          onClick={()=>{
            addBreadcrumb({label: client_name, path: `/members-list/${encodeURIComponent(client_name)}?memberId=${id}`})
          }}
          >
            {project_count}
          </NavLink>;
        },
        size: 80,
      },
      {
        id: "action",
        header: () => (
          <>
            <ActionIcon /> <span className="title">{t.table.action}</span>
          </>
        ),
        cell: ({ row }: any) => {
          const { id, client_name } = row.original;
          return <NavLink to={`/members-list/${client_name}/parameters?clientId=${id}`}
           onClick={()=>{
            addBreadcrumb({label: client_name, path: `/members-list/${encodeURIComponent(client_name)}/parameters?clientId=${id}`})
           }}
           className={'text-underline'}>
            <EditIcon
              width={18}
              height={18}
            />
          </NavLink>;
        },
        size: 80,
      },
    ];

  const handlePageChange = (pageIndex: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
  };

  const { data: clientList } = useQuery({
    queryKey: ["clientList", queryParams, selectedLang],
    queryFn: () => getRMClientList({ ...queryParams, language: selectedLang }),
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
        rm_name: `${rm_first_name} ${(rm_last_name ?? "").trim()}`.trim(),
        assigned_date: assigned_date
          ? new Date(assigned_date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : null,
        primary_percentage: stats?.[0]?.primaryPercentage ?? 0,
        secondary_percentage: stats?.[0]?.secondaryPercentage ?? 0,
      })
    );
  }
  return (
    <div className="member-list-page">
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
        columns={columns()}
        data={updatedClientList}
        itemsPerPage={itemsPerPage}
        total_rms={total_clients}
        hasNextPage={clientList?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        // onRowClick={handleRowClick}
        customColumnWidth={true}
        enableTableScroll={true}
      />
    </div>
  );
};

export default ClientListPage;

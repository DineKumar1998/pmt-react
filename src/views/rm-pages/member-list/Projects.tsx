import UserIcon from "@/views/components/icons/table/User";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import BagIcon from "@/views/components/icons/table/Bag";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { getRMClientProjects } from "@/apis/rm-portal/client";
import "./index.scss";
import ActionIcon from "@/views/components/icons/table/Action";
import MciIndexIcon from "@/views/components/icons/table/MCI";
import { BackButton } from "@/views/components/BackButton";
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

const ClientProjects: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const {addBreadcrumb} = useBreadcrumbs()
 
  const { memberName = "" } = useParams();

  const [searchParams] = useSearchParams();

  const id = searchParams.get('memberId') || "";

  const itemsPerPage = 10;
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    search: "",
  });

  const columns: any = [
    {
      accessorKey: "id",
      header: () => (
        <>
          <ProfileWithOptionsIcon /><span className="title"> {t.table.projectCode}</span>
        </>
      ),
      size: 40,
    },
    {
      accessorKey: "name",
      header: () => (
        <>
          <UserIcon /> {t.table.projectName}
        </>
      ),
      size: 120,
    },
    {
      accessorKey: "industry",
      header: () => (
        <>
          <BagIcon /> {t.table.industry}
        </>
      ),
      size: 120,
    },
    {
      accessorKey: "status",
      header: () => (
        <>
          <BagIcon /> {t.table.status}
        </>
      ),
      size: 120,
      cell: ({ row }: any) => {
        return <div>{row.original.status?.toUpperCase()}</div>;
      },
    },
    {
      id: "manageWeightage",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ActionIcon /> {t.table.mciIndex}
        </div>
      ),
      size: 80,
      cell: (info: any) => {
        const { name, id } = info.row.original;
        return (
          <div style={{ display: "flex", justifyContent: "center", width: "50%" }}>
            <NavLink to={`/members-list/${encodeURIComponent(memberName)}/${encodeURIComponent(name)}?projectId=${id}`}
              onClick={() => {
                addBreadcrumb({label: name, path: `/members-list/${encodeURIComponent(memberName)}/${encodeURIComponent(name)}?projectId=${id}`})
              }}
            >
              <MciIndexIcon
                width={20}
                height={20}
                style={{ cursor: "pointer" }}
              />
            </NavLink>
          </div>
        )
      },
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
    queryFn: () =>
      getRMClientProjects(+id!, { ...queryParams, language: selectedLang }),
    enabled: !!id,
  });

  const total_clients = clientList?.totalCount ?? 0;

  let updatedClientList: Client[] = [];
  if (clientList?.data?.length) {
    updatedClientList = clientList.data;
  }


  return (
    <div className="member-list-page">

      <div className="buttons">
        <BackButton title="Back" />

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
        // onRowClick={handleRowClick}
        customColumnWidth={true}
        enableTableScroll={true}
      />
    </div>
  );
};

export default ClientProjects;

import UserIcon from "@/views/components/icons/table/User";
import BagIcon from "@/views/components/icons/table/Bag";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import ActionIcon from "@/views/components/icons/table/Action";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { getRMClientProjects } from "@/apis/client";
import MciIndexIcon from "@/views/components/icons/table/MCI";
import { BackButton } from "@/views/components/BackButton";
import { preserveQueryParams } from "@/utils/queryParams";

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

const ClientProjects: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get("memberId");
  const { addBreadcrumb } = useBreadcrumbs();
  const { memberName = "", rmName = "" } = useParams();

  const itemsPerPage = 10;
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    search: "",
  });

  const columns: any = [
    {
      accessorKey: "name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.projectName}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "industry",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <BagIcon /> {t.table.industry}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "status",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocationIcon /> {t.table.status}
        </div>
      ),
      size: 80,
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
        const { name, id , client_name} = info.row.original;
        const url = preserveQueryParams(
          `/member-list/${encodeURIComponent(memberName)}/${encodeURIComponent(
            name
          )}`,
          searchParams,
          {
            clientId: memberId ?? "",
            projectId: id.toString(),
          }
        );
        return (
          <div
            style={{ display: "flex", justifyContent: "center", width: "50%" }}
          >
            <NavLink
              to={url}
              onClick={() => addBreadcrumb({ path: url, label: name })}
            >
              <MciIndexIcon
                width={20}
                height={20}
                style={{ cursor: "pointer" }}
              />
            </NavLink>
          </div>
        );
      },
    },
  ];

  //

  const handlePageChange = (pageIndex: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
  };

  const { data: projectsList } = useQuery({
    queryKey: ["projectsList", queryParams, selectedLang],
    queryFn: () =>
      getRMClientProjects(+memberId!, {
        ...queryParams,
        language: selectedLang,
      }),
    enabled: !!memberId,
  });

  const total_projects = projectsList?.totalCount ?? 0;

  let updatedProjectsList: Client[] = [];
  if (projectsList?.data?.length) {
    updatedProjectsList = projectsList.data;
  }

  return (
    <div className="member-list-page">
      <div className="buttons">
        <div className="d-flex">
          <BackButton backUrl="/member-list" title="Back" />
          <h4>Project list</h4>
        </div>
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
        data={updatedProjectsList}
        itemsPerPage={itemsPerPage}
        total_rms={total_projects}
        hasNextPage={projectsList?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        customColumnWidth={true}
        enableTableScroll={true}
      />
    </div>
  );
};

export default ClientProjects;

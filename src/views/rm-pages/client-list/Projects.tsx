import UserIcon from "@/views/components/icons/table/User";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import BagIcon from "@/views/components/icons/table/Bag";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { useNavigate, useParams } from "react-router-dom";
import { getRMClientProjects } from "@/apis/rm-portal/client";
import Button from "@/views/components/button";
import BackArrow from "@/views/components/icons/BackArrow";
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

const ClientProjects: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const { id } = useParams();
  const navigate = useNavigate()
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
    // .map(
    //   ({
    //     name,
    //     rm_last_name,
    //     assigned_date,
    //     stats,
    //     ...rest
    //   }: {
    //     name: string;
    //     assigned_date: string | null;
    //     stats: any | null;
    //     [key: string]: any;
    //   }) => ({
    //     ...rest,
    //     rm_name: `${project_name} ${(rm_last_name ?? "").trim()}`.trim(),
    //     assigned_date: assigned_date
    //       ? new Date(assigned_date).toLocaleString("en-GB", {
    //           day: "2-digit",
    //           month: "short",
    //           year: "numeric",
    //         })
    //       : null,
    //     primary_percentage: stats?.[0]?.primaryPercentage ?? 0,
    //     secondary_percentage: stats?.[0]?.secondaryPercentage ?? 0,
    //   })
    // );
  }

  const backButtonHandler = () => {
    navigate(-1);
  };
  return (
    <div className="client-list-page">
      <div className="buttons">
        <Button
          text={t.buttons.back}
          icon={<BackArrow />}
          onClick={backButtonHandler}
          className="mr-1"
        />
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

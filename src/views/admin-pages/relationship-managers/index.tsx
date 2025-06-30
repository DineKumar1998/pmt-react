import Button from "@/views/components/button";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import UserIcon from "@/views/components/icons/table/User";
import ClockIcon from "@/views/components/icons/table/Clock";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import UserGroupIcon from "@/views/components/icons/table/UserGroup";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import "./index.scss";
import AddCircle from "@/views/components/icons/AddCircle";
import BackArrow from "@/views/components/icons/BackArrow";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { getRMList } from '@/apis/rm';
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";

type RM = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  last_login: string | null;
  clients_assigned_count: number;
};

const RelationshipManagerPage: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const itemsPerPage = 10;
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    search: "",
  });

  const columns: ColumnDef<RM>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ProfileWithOptionsIcon /> {t.table.rmId}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.name}
        </div>
      ),

    },
    {
      accessorKey: "email",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LocationIcon /> {t.table.email}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.phone}
        </div>
      ),
    },
    {
      accessorKey: "last_login",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ClockIcon /> {t.table.lastLogin}
        </div>
      ),
    },
    {
      accessorKey: "clients_assigned_count",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserGroupIcon /> {t.table.clientAssigned}
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleAddRM = () => {
    navigate("/relationship-managers/add-rm");
  };

  const backButtonHandler = () => {
    console.log("Back button clicked");
    navigate(-1);
  };

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
      `/relationship-managers/edit-rm/${id}`,
    )
  };


  const { data: rmList } = useQuery({
    queryKey: ['rmList', queryParams, selectedLang],
    queryFn: () =>
      getRMList({ ...queryParams, language: selectedLang }),
  });

  const total_rms = rmList?.totalCount ?? 0;

  let updatedRmList: RM[] = [];
  if (rmList?.data?.length) {
    updatedRmList = rmList.data.map(
      ({
        first_name,
        last_name,
        last_login,
        country_code,
        phone,
        ...rest
      }: {
        first_name: string;
        last_name?: string | null;
        last_login: string | null;
        country_code?: string | null;
        phone?: string | null;
        [key: string]: any;
      }) => ({
        ...rest,
        name: `${first_name} ${(last_name ?? '').trim()}`.trim(),
        last_login: last_login
          ? new Date(last_login).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          : null,
        phone: country_code?.trim() && phone?.trim() ? `${country_code}${phone}` : ""
      })
    );
  }

  return (
    <div className="relationship-manager-page">
      <div className="buttons">
        <Button
          text={t.buttons.back}
          icon={<BackArrow />}
          onClick={backButtonHandler}
        />
        <Button text={t.buttons.addRM} icon={<AddCircle />} onClick={handleAddRM} />

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
        data={updatedRmList}
        itemsPerPage={itemsPerPage}
        total_rms={total_rms}
        hasNextPage={rmList?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default RelationshipManagerPage;

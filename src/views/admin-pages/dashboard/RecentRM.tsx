import ClockIcon from "@/views/components/icons/table/Clock";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import UserIcon from "@/views/components/icons/table/User";
import UserGroupIcon from "@/views/components/icons/table/UserGroup";
import { useQuery } from '@tanstack/react-query';
import { getRMByRecentActivity } from "@/apis/rm"

type RM = {
  id: number;
  name: string;
  last_login: string | null;
  clients_assigned_count: number;
};

const RecentRM: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const listLimit = 5;

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

  const { data: rmList } = useQuery({
    queryKey: ['recentRmList', selectedLang],
    queryFn: () =>
      getRMByRecentActivity({ limit: listLimit, language: selectedLang }),
  });


  let updatedRmList: RM[] = [];
  if (rmList?.length) {
    updatedRmList = rmList.map(
      ({
        first_name,
        last_name,
        last_login,
        ...rest
      }: {
        first_name: string;
        last_name?: string | null;
        last_login?: string | null;
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
      })
    );
  }

  return (
    updatedRmList?.length ?
      <div className="relationship-manager-page">
        <h2 className="section-title">{t.heading.rmRecentActivity}</h2>

        <Table
          columns={columns}
          data={updatedRmList}
        />
      </div>
      : null
  );
};

export default RecentRM;

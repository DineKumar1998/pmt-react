import ClockIcon from "@/views/components/icons/table/Clock";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import UserIcon from "@/views/components/icons/table/User";
import UserGroupIcon from "@/views/components/icons/table/UserGroup";
import { useQuery } from "@tanstack/react-query";
import { getRMByRecentActivity } from "@/apis/rm";
import { NavLink } from "react-router-dom";
import { useBreadcrumbs } from "@/context/Breadcrumb";

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
  const { addBreadcrumb } = useBreadcrumbs();

  const columns: ColumnDef<RM>[] = [
    {
      accessorKey: "name",
      header: () => (
        <>
          <UserIcon /> {t.table.name}
        </>
      ),
      cell: ({ row }: any) => {
        const { id, name } = row.original;
        return (
          <NavLink
            to={`/relationship-managers/edit-rm/${id}`}
            onClick={() => addBreadcrumb({ path: `/relationship-managers/edit-rm/${id}`, label: name })}
            className={"text-underline"}
          >
            {name}
          </NavLink>
        );
      },
    },
    {
      accessorKey: "last_login",
      header: () => (
        <>
          <ClockIcon /> {t.table.lastLogin}
        </>
      ),
    },
    {
      accessorKey: "clients_assigned_count",
      header: () => (
        <>
          <UserGroupIcon />{" "}
          <span className="title">{t.table.memberAssigned}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, clients_assigned_count, name } = row.original;
        return (
          <div className="text-center">
            <NavLink
              to={`/relationship-managers/rm?rmId=${id}&rmName=${name}`}
              className={"text-underline "}
              onClick={() => addBreadcrumb({ path: `/relationship-managers/rm?rmId=${id}&rmName=${name}`, label: name })}
            >
              {clients_assigned_count}
            </NavLink>
          </div>
        );
      },
    },
  ];

  const { data: rmList } = useQuery({
    queryKey: ["recentRmList", selectedLang],
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
        name: `${first_name} ${(last_name ?? "").trim()}`.trim(),
        last_login: last_login
          ? new Date(last_login).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : null,
      })
    );
  }

  return (
    <div className="relationship-manager-page">
      <h2 className="section-title">{t.heading.rmRecentActivity}</h2>

      <Table columns={columns} data={updatedRmList} customColumnWidth={true} />
    </div>
  );
};

export default RecentRM;

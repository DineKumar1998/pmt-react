import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import UserIcon from "@/views/components/icons/table/User";
import { useQuery } from "@tanstack/react-query";
import { getRecentlyAssignedClients } from "@/apis/rm-portal/client";
import ClockIcon from "@/views/components/icons/table/Clock";
import { EditIcon } from "@/views/components/icons";
import { useNavigate } from "react-router-dom";

type Client = {
  id: number;
  client_name: string;
  industry_name: string | null;
  rm_name: string | null;
};

const RecentClient: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const listLimit = 5;
  const navigate = useNavigate();


  const handleEditClick = (id: number) => {
    navigate(`/client-list/projects/${id}`);
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: () => (
        <>
          <ProfileWithOptionsIcon /> {t.table.id}
        </>
      ),
    },
    {
      accessorKey: "client_name",
      header: () => (
        <>
          <UserIcon /> {t.table.clientName}
        </>
      ),
    },
    {
      id: "assigned_date",
      header: () => (
        <>
          <ClockIcon /> {t.table.assignDate}
        </>
      ),
      cell: ({ row }: any) => {
        const { id, assigned_date } = row.original;
        return <div className="date_view">
          <p>{assigned_date}</p>
          <EditIcon
            onClick={() => handleEditClick(id)}
            width={18}
            height={18}
            style={{ cursor: "pointer" }}
          />
        </div>;
      },
    },
  ];

  const { data: clientList } = useQuery({
    queryKey: ["recentAssignedClientList", selectedLang],
    queryFn: () =>
      getRecentlyAssignedClients({ limit: listLimit, language: selectedLang }),
  });

  let updatedClientList: Client[] = [];
  if (clientList?.length) {
    updatedClientList = clientList.map(
      ({
        rm_first_name,
        rm_last_name,
        assigned_date,
        ...rest
      }: {
        rm_first_name: string;
        rm_last_name?: string | null;
        assigned_date?: string | null;
        [key: string]: any;
      }) => ({
        ...rest,
        rm_name: `${rm_first_name} ${(rm_last_name ?? "").trim()}`.trim(),
        assigned_date: assigned_date
          ? new Date(assigned_date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            // hour: "2-digit",
            // minute: "2-digit",
            // hour12: true,
          })
          : null,
      })
    );
  }

  return <div className="recent-added-clients-page">
      <h2 className="section-title">{t.heading.clientRecentlyAssigned}</h2>
      <Table columns={columns} data={updatedClientList} />
    </div>
};

export default RecentClient;

import ClockIcon from "@/views/components/icons/table/Clock";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import UserIcon from "@/views/components/icons/table/User";
import { useQuery } from "@tanstack/react-query";
import { getRecentActivityClients } from "@/apis/rm-portal/client";
import { EditIcon } from "@/views/components/icons";
import { useNavigate } from "react-router-dom";

type Client = {
  id: number;
  client_name: string;
  industry_name: string | null;
  rm_name: string | null;
};

const RecentActivity: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const listLimit = 5;

  const navigate = useNavigate();


  const handleEditClick = (id: number) => {
    console.log("handleRowClick:", id);
    navigate(`/client-list/projects/${id}`);
  };

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
          <UserIcon /> {t.table.clientName}
        </div>
      ),
    },
    {
      id: "last_parameter_update",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ClockIcon /> {t.formLabel.lastUpdated}
        </div>
      ),
      cell: ({ row }: any) => {
        const { id, last_parameter_update } = row.original;
        return <div className="date_view">
          <p>{last_parameter_update}</p>
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
    queryKey: ["recentActivityClientList", selectedLang],
    queryFn: () =>
      getRecentActivityClients({ limit: listLimit, language: selectedLang }),
  });

  let updatedClientList: Client[] = [];
  if (clientList?.length) {
    updatedClientList = clientList.map(
      ({
        last_parameter_update,
        ...rest
      }: {
        last_parameter_update?: string | null;
        [key: string]: any;
      }) => ({
        ...rest,
        last_parameter_update: last_parameter_update
          ? new Date(last_parameter_update).toLocaleString("en-GB", {
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

  return updatedClientList?.length ? (
    <div className="recent-added-clients-page">
      <h2 className="section-title">{t.heading.clientRecentActivity}</h2>
      <Table columns={columns} data={updatedClientList} />
    </div>
  ) : null;
};

export default RecentActivity;

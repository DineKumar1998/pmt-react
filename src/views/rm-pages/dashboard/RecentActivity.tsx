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
import { NavLink } from "react-router-dom";
import { useBreadcrumbs } from "@/context/Breadcrumb";

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
const {addBreadcrumb} = useBreadcrumbs()

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "client_name",
      header: () => (
        <>
          <UserIcon /> {t.table.clientName}
        </>
      ),
    },
    {
      id: "last_parameter_update",
      header: () => (
        <>
          <ClockIcon /> {t.formLabel.lastUpdated}
        </>
      ),
      cell: ({ row }: any) => {
        const { last_parameter_update } = row.original;
        return <div className="date_view" style={{ marginLeft: '1rem'}}>
          <p>{last_parameter_update}</p>
        </div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => (
        <>
          <ProfileWithOptionsIcon /> <span className="title">{t.table.action}</span>
        </>
      ),
      size: 80,
      cell: ({ row }: any) => {
        const { id, client_name } = row.original;
        return <NavLink to={`/members-list/${encodeURIComponent(client_name)}?memberId=${id}`} 
        onClick={()=>{
          addBreadcrumb({label: client_name, path: `/members-list/${encodeURIComponent(client_name)}?memberId=${id}`})
        }}
        >
          <EditIcon
          width={18}
          height={18}
        />
        </NavLink>
      }
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

  return (
    <div className="recent-added-clients-page">
      <h2 className="section-title">{t.heading.clientRecentActivity}</h2>
      <Table columns={columns} data={updatedClientList} customColumnWidth={true} />
    </div>
  );
};

export default RecentActivity;

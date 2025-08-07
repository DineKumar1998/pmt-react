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
import { NavLink, useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "@/context/Breadcrumb";

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
const {addBreadcrumb} = useBreadcrumbs()

  const handleEditClick = (id: number) => {
    navigate(`/members-list/projects/${id}`);


  };

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
      id: "assigned_date",
      header: () => (
        <>
          <ClockIcon /> {t.table.assignDate}
        </>
      ),
      cell: ({ row }: any) => {
        const { assigned_date } = row.original;
        return <div className="date_view" style={{ marginLeft: '1rem'}} >
          <p>{assigned_date}</p>

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
    <Table columns={columns} data={updatedClientList} customColumnWidth={true} />
  </div>
};

export default RecentClient;

import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import UserIcon from "@/views/components/icons/table/User";
import BagIcon from "@/views/components/icons/table/Bag";
import { useQuery } from '@tanstack/react-query';
import { getRecentlyAddedClients } from "@/apis/client"

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
          <UserIcon /> {t.table.name}
        </div>
      ),
    },
    {
      accessorKey: "industry_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <BagIcon /> {t.table.industry}
        </div>
      ),
    },
    {
      accessorKey: "rm_name",
      header: () => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UserIcon /> {t.table.rm}
        </div>
      ),
    },
  ];

  const { data: clientList } = useQuery({
    queryKey: ['clientList', selectedLang],
    queryFn: () =>
      getRecentlyAddedClients({ limit: listLimit, language: selectedLang }),
  });

  console.log("clientList=", clientList)

  let updatedClientList: Client[] = [];
  if (clientList?.length) {
    updatedClientList = clientList.map(
      ({
        rm_first_name,
        rm_last_name,
        ...rest
      }: {
        rm_first_name: string;
        rm_last_name?: string | null;
        [key: string]: any;
      }) => ({
        ...rest,
        rm_name: `${rm_first_name} ${(rm_last_name ?? '').trim()}`.trim(),
      })
    );
  }

  return (
    updatedClientList?.length ?
      <div className="recent-added-clients-page">
        <h2 className="section-title">{t.heading.clientRecentlyAdded}</h2>
        <Table
          columns={columns}
          data={updatedClientList}
        />
      </div>
      : null
  );
};

export default RecentClient;

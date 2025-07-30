import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
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
      accessorKey: "client_name",
      header: () => (
        <>
          <UserIcon /> {t.table.name}
        </>
      ),
    },
    {
      accessorKey: "industry_name",
      header: () => (
        <>
          <BagIcon /> {t.table.industry}
        </>
      ),
    },
    {
      accessorKey: "rm_name",
      header: () => (
        <>
          <UserIcon /> {t.table.rm}
        </>
      ),
    },
  ];

  const { data: clientList } = useQuery({
    queryKey: ['clientList', selectedLang],
    queryFn: () =>
      getRecentlyAddedClients({ limit: listLimit, language: selectedLang }),
  });

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
    <div className="recent-added-clients-page">
      <h2 className="section-title">{t.heading.memberRecentlyAdded}</h2>
      <Table
        columns={columns}
        data={updatedClientList}
      />
    </div>
  );
};

export default RecentClient;

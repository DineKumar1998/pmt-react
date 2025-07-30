import Button from "@/views/components/button";
import UserIcon from "@/views/components/icons/table/User";
import ClockIcon from "@/views/components/icons/table/Clock";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import UserGroupIcon from "@/views/components/icons/table/UserGroup";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import AddCircle from "@/views/components/icons/AddCircle";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { getRMList } from '@/apis/rm';
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";

import "./index.scss";

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

  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
 // Create an object for new search params
    const newSearchParams = new URLSearchParams();

    if (queryParams.page > 1) {
      newSearchParams.set('page', queryParams.page.toString());
    }
    if (queryParams.search) {
      newSearchParams.set('search', queryParams.search);
    }

    setSearchParams(newSearchParams, { replace: true });
  }, [])

  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);

     if (urlPage !== queryParams.page) {
      setQueryParams(prev => ({
        ...prev,
        page: urlPage,
      }));
    }

  }, [])

  const [queryParams, setQueryParams] = useState({
    page: initialPage,
    pageSize: itemsPerPage,
    search: "",
  });

  const columns: ColumnDef<RM>[] = [
    {
      accessorKey: "name",
      header: () => (
        <>
          <UserIcon />  <span className="title">{t.table.name}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, name } = row.original;
        return <div>
          <NavLink
            to={`/relationship-managers/edit-rm/${id}`}
            className="text-underline"
          >
            {name}
          </NavLink>
        </div>;
      },
    },
    {
      accessorKey: "email",
      header: () => (
        <>
          <LocationIcon /> {t.table.email}
        </>
      ),
    },
    {
      accessorKey: "phone",
      header: () => (
        <>
          <UserIcon /> {t.table.phone}
        </>
      ),
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
          <UserGroupIcon /> <span className="title">{t.table.memberAssigned}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, clients_assigned_count, name } = row.original;
        return <section className="text-center">
          <NavLink to={`/relationship-managers/rm?rmId=${id}&rmName=${name}`} className="text-underline">
          {clients_assigned_count}
        </NavLink>
        </section>
      },
    },
  ];

  const navigate = useNavigate();

  const handleAddRM = () => {
    navigate("/relationship-managers/add-rm");
  };

  const handlePageChange = (pageIndex: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
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
        enableTableScroll={true}
      />
    </div>
  );
};

export default RelationshipManagerPage;

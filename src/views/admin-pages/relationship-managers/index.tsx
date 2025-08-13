import Button from "@/views/components/button";
import UserIcon from "@/views/components/icons/table/User";
import ClockIcon from "@/views/components/icons/table/Clock";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import UserGroupIcon from "@/views/components/icons/table/UserGroup";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddCircle from "@/views/components/icons/AddCircle";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRMList } from "@/apis/rm";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";

import "./index.scss";
import { useBreadcrumbs } from "@/context/Breadcrumb";
import { debounce } from "@/utils/methods";

type RM = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  last_login: string | null;
  clients_assigned_count: number;
};

const RelationshipManagerPage: React.FC = () => {
  const { addBreadcrumb } = useBreadcrumbs();
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams = {
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: parseInt(
      searchParams.get("pageSize") || itemsPerPage.toString(),
      10
    ),
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "",
  };

  // const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [queryParams, setQueryParams] = useState(initialParams);
  const [search, setSearch] = useState(queryParams.search);

  // useEffect(() => {
  //   // Create an object for new search params
  //   const newSearchParams = new URLSearchParams();

  //   if (queryParams.page > 1) {
  //     newSearchParams.set("page", queryParams.page.toString());
  //   }
  //   if (queryParams.search) {
  //     newSearchParams.set("search", queryParams.search);
  //   }

  //   setSearchParams(newSearchParams, { replace: true });
  // }, []);

  // useEffect(() => {
  //   const urlPage = parseInt(searchParams.get("page") || "1", 10);

  //   if (urlPage !== queryParams.page) {
  //     setQueryParams((prev) => ({
  //       ...prev,
  //       page: urlPage,
  //     }));
  //   }
  // }, []);
  // Sync state from URL whenever searchParams changes
  useEffect(() => {
    const paramsFromUrl = {
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(
        searchParams.get("pageSize") || itemsPerPage.toString(),
        10
      ),
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "",
    };

    setQueryParams((prev) => {
      // Only update if something actually changed
      const changed = Object.entries(paramsFromUrl).some(
        ([key, value]) =>
          String(prev[key as keyof typeof prev]) !== String(value)
      );
      return changed ? { ...prev, ...paramsFromUrl } : prev;
    });
  }, [searchParams]);

  // Sync state → URL whenever queryParams changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        newSearchParams.set(key, String(value));
      }
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [queryParams, setSearchParams]);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    if (urlPage !== queryParams.page) {
      setQueryParams((prev) => ({
        ...prev,
        page: urlPage,
      }));
    }
  }, []);

  const columns: ColumnDef<RM>[] = [
    {
      accessorKey: "first_name",
      header: () => (
        <>
          <UserIcon /> <span className="title">{t.table.name}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, name } = row.original;
        return (
          <div>
            <NavLink
              to={`/relationship-managers/edit?rmId=${id}`}
              className="text-underline"
              onClick={() =>
                addBreadcrumb({
                  label: "Edit",
                  path: `/relationship-managers/edit?rmId=${id}`,
                })
              }
            >
              {name}
            </NavLink>
          </div>
        );
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
          <UserGroupIcon />{" "}
          <span className="title">{t.table.memberAssigned}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, clients_assigned_count, name } = row.original;
        return (
          <section className="text-center">
            <NavLink
              to={`/relationship-managers/${encodeURIComponent(
                name
              )}?rmId=${id}`}
              onClick={() =>
                addBreadcrumb({
                  label: name || "NA",
                  path: `/relationship-managers/${encodeURIComponent(
                    name
                  )}?rmId=${id}`,
                })
              }
              className="text-underline"
            >
              {clients_assigned_count}
            </NavLink>
          </section>
        );
      },
    },
  ];

  const navigate = useNavigate();

  const handleAddRM = () => {
    navigate("/relationship-managers/add");
    addBreadcrumb({
      label: "Add",
      path: "/relationship-managers/add",
    });
  };

  const handlePageChange = (pageIndex: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
  };

  const { data: rmList } = useQuery({
    queryKey: ["rmList", queryParams, selectedLang],
    queryFn: () => getRMList({ ...queryParams, language: selectedLang }),
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
        phone:
          country_code?.trim() && phone?.trim()
            ? `${country_code}${phone}`
            : "",
      })
    );
  }

  const sortFn = useCallback((dir: SortingState) => {
    const sort = dir[0];

    const dirLabel = sort ? (sort.desc ? "desc" : "asc") : null;

    setQueryParams((prev) => {
      if (prev.sort === dirLabel) {
        return prev;
      }
      return { ...prev, sort: dir[0]?.id ? `${dir[0]?.id}:${dirLabel}` : "" };
    });
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQueryParams((prev) => ({
          ...prev,
          page: 1,
          search: value ?? "",
        }));
      }, 500),
    []
  );

  return (
    <div className="relationship-manager-page">
      <div className="buttons">
        <Button
          text={t.buttons.addRM}
          icon={<AddCircle />}
          onClick={handleAddRM}
        />

        <SearchComponent
          value={search}
          placeholder={`${t.buttons.search}...`}
          onSearch={(value) => {
            setSearch(value || "");
            debouncedSearch(value || "");
          }}
        />
      </div>
      <Table
        columns={columns}
        pageIndex={queryParams.page}
        data={updatedRmList}
        onSortChange={sortFn}
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

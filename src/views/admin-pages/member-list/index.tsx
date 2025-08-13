import TrendingIcon from "@/views/components/icons/table/Trending";
import UserIcon from "@/views/components/icons/table/User";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import ActionIcon from "@/views/components/icons/table/Action";
import BagIcon from "@/views/components/icons/table/Bag";
import EditIcon from "@/views/components/icons/Edit";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientList } from "@/apis/client";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { NavLink, useSearchParams } from "react-router-dom";
import "./index.scss";
import Badges from "@/views/components/badges";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import DownArrow from "@/views/components/icons/DownArrow";
import { ClientTypes } from "@/utils/constants";
import { preserveQueryParams } from "@/utils/queryParams";
import { useBreadcrumbs } from "@/context/Breadcrumb";
import { debounce } from "@/utils/methods";
import { MemebrType } from "@/views/components/ui/MemberType";

type Client = {
  id: number;
  client_name: string;
  industry_name: string | null;
  address: string | null;
  assigned_date: string | null;
  rm_name: string | null;
  project_count: number | null;
  primary_percentage: number;
  secondary_percentage: number;
};

export const ProgressBar = ({
  value,
  isPrimary,
}: {
  value: number;
  isPrimary?: boolean;
}) => (
  <div className="progress-bar">
    <div
      className={`progress-bar-fill ${
        isPrimary ? "primary-fill" : "secondary-fill"
      }`}
      style={{
        width: `${value}%`,
      }}
    />
  </div>
);

const ClientListPage: React.FC = () => {
  const { selectedLang } = useLang();
  const { addBreadcrumb } = useBreadcrumbs();

  const t = translations[selectedLang];
  const itemsPerPage = 10;

  // const { rmName = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,setSearch] = useState('')
  const initialParams = {
    page: parseInt(searchParams.get("page") || "1", 10),
    pageSize: parseInt(
      searchParams.get("pageSize") || itemsPerPage.toString(),
      10
    ),
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "",
    clientType: searchParams.get("clientType") || "All",
  };

  const [queryParams, setQueryParams] = useState(initialParams);

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: () => (
        <>
          <UserIcon /> {t.table.name}
        </>
      ),
      cell: ({ row }: any) => {
        const { id, client_name } = row.original;
        const url = preserveQueryParams(`/member-list/edit`, searchParams, {
          memberId: id.toString(),
        });
        return (
          <NavLink
            to={url}
            className="text-underline"
            onClick={() =>
              addBreadcrumb({
                label: "Edit",
                path: url,
              })
            }
          >
            {client_name || "NAN"}
          </NavLink>
        );
      },
      size: 120,
    },
    {
      accessorKey: "type",
      enableSorting: false,
      header: () => (
        <>
          <UserIcon /> {t.table.type}
        </>
      ),
      size: 80,
      cell: ({ row }: any) => <MemebrType type={row.original.type} />,
    },
    {
      accessorKey: "level",
      enableSorting: false,

      header: () => (
        <>
          <LocationIcon /> {t.table.level}
        </>
      ),
      size: 100,
      cell: ({ row }: any) => {
        const { level } = row.original;
        if (level != null) {
          return <Badges.Info>{level}</Badges.Info>;
        }
        return "--";
      },
    },
    {
      accessorKey: "industry_name",
      header: () => (
        <>
          <BagIcon /> <span className="title"> {t.table.industry}</span>
        </>
      ),
      size: 130,
      // enableSorting: false,
      cell: ({ row }: any) => {
        const { industry_name } = row.original;
        return <span>{industry_name}</span>;
      },
    },
    {
      id: "status",
      enableSorting: false,
      header: () => (
        <>
          <LocationIcon /> {t.formLabel.status}
        </>
      ),
      cell: ({ row }) => {
        const { primary_percentage, secondary_percentage } = row.original;
        return (
          <div className="progress-bar-wrapper">
            <div className="progress-bar-container">
              <span>P</span>
              <ProgressBar value={primary_percentage} isPrimary={true} />
              <span>{primary_percentage}%</span>
            </div>

            <div className="progress-bar-container">
              <span>S</span>
              <ProgressBar value={secondary_percentage} />
              <span>{secondary_percentage}%</span>
            </div>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "address",
      enableSorting: false,
      header: () => (
        <>
          <LocationIcon /> {t.table.address}
        </>
      ),
      size: 150,
    },
    {
      accessorKey: "rm_name",
      header: () => (
        <>
          <UserIcon /> <span className="title"> {t.table.rmAssigned}</span>
        </>
      ),
      size: 100,
    },
    {
      accessorKey: "project_count",
      header: () => (
        <>
          <TrendingIcon />{" "}
          <span className="title">{t.table.activeProjects}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, project_count, client_name } = row.original;
        const url = preserveQueryParams(
          `/member-list/${encodeURIComponent(client_name || "NAN")}`,
          searchParams,
          { memberId: id.toString() }
        );
        return (
          <div className="text-center">
            <NavLink
              onClick={() =>
                addBreadcrumb({
                  label: client_name || "NAN",
                  path: url,
                })
              }
              to={url}
              className="text-underline"
            >
              {project_count}
            </NavLink>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "action",
      header: () => (
        <>
          <ActionIcon /> <span className="title">{t.table.action}</span>
        </>
      ),
      cell: ({ row }: any) => {
        const { id, client_name } = row.original;
        const url = preserveQueryParams(
          `/member-list/${encodeURIComponent(client_name || 'NA')}/parameters`,
          searchParams,
          {
            clientId: id.toString(),
            clientName: client_name || "NAN",
          }
        );
        return (
          <NavLink
            to={url}
            onClick={() =>
              addBreadcrumb({
                label: client_name,
                path: url,
              })
            }
          >
            <EditIcon width={18} height={18} />
          </NavLink>
        );
      },
      size: 80,
    },
  ];

  const handlePageChange = (pageIndex: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pageIndex,
    }));
  };

  const { data: clientList } = useQuery({
    queryKey: ["clientList", queryParams, selectedLang],
    queryFn: () => getClientList({ ...queryParams, language: selectedLang }),
  });

  const total_clients = clientList?.totalCount ?? 0;

  let updatedClientList: Client[] = [];
  if (clientList?.data?.length) {
    updatedClientList = clientList.data.map(
      ({
        rm_first_name,
        rm_last_name,
        assigned_date,
        stats,
        ...rest
      }: {
        rm_first_name: string;
        rm_last_name?: string | null;
        assigned_date: string | null;
        stats: any | null;
        [key: string]: any;
      }) => ({
        ...rest,
        rm_name: `${rm_first_name} ${(rm_last_name ?? "").trim()}`.trim(),
        assigned_date: assigned_date
          ? new Date(assigned_date).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null,
        primary_percentage: stats?.[0]?.primaryPercentage ?? 0,
        secondary_percentage: stats?.[0]?.secondaryPercentage ?? 0,
      })
    );
  }

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
  useEffect(() => {
    const paramsFromUrl = {
      page: parseInt(searchParams.get("page") || "1", 10),
      pageSize: parseInt(
        searchParams.get("pageSize") || itemsPerPage.toString(),
        10
      ),
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || "",
      clientType: searchParams.get("clientType") || "All",
    };
    setSearch(searchParams.get('search') || '')

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
  return (
    <div className="member-list-page">
      <div className="header-section">
        <Combobox
          value={queryParams.clientType}
          onChange={(event) => {
            if (event) {
              // setSelectedScale(event);
              const scaleParam = new URLSearchParams(searchParams.toString());
              scaleParam.set("type", event);
              setSearchParams(scaleParam);
              setQueryParams((prev) => ({ ...prev, clientType: event }));
            }
          }}
          as="div"
          className="combobox-container"
        >
          <ComboboxButton
            className="combobox-button"
            style={{ width: "200px" }}
          >
            <ComboboxInput
              className="input-field"
              aria-label="Scale"
              placeholder="Select a type"
            />
            <DownArrow height={16} width={16} />
          </ComboboxButton>
          <ComboboxOptions anchor="bottom" className="combobox-options">
            {["All", ...ClientTypes].map((scale: string, index: number) => (
              <ComboboxOption
                key={index}
                value={scale}
                className="combobox-option"
              >
                {scale}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
        <SearchComponent
          value={search}
          placeholder={`${t.buttons.search}...`}
          onSearch={(value) => {
            setSearch(value || '')
            debouncedSearch(value || "")}}
        />
      </div>
      <Table
        onSortChange={sortFn}
        columns={columns}
        data={updatedClientList}
        itemsPerPage={itemsPerPage}
        total_rms={total_clients}
        hasNextPage={clientList?.hasNextPage ?? false}
        onPageChange={handlePageChange}
        customColumnWidth={true}
        enableTableScroll={true}
      />
    </div>
  );
};

export default ClientListPage;

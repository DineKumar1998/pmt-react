import UserIcon from "@/views/components/icons/table/User";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getClientList } from "@/apis/client";
import { getRMNames } from "@/apis/rm";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import TrendingIcon from "@/views/components/icons/table/Trending";
import ActionIcon from "@/views/components/icons/table/Action";
import EditIcon from "@/views/components/icons/Edit";
import DownArrow from "@/views/components/icons/DownArrow";
import { BackButton } from "@/views/components/BackButton";

import "./index.scss";
import { useBreadcrumbs } from "@/context/Breadcrumb";
// import { breadcrumbMapping } from "@/utils/breadcrumbs";
import { debounce } from "@/utils/methods";
// import {
//   Combobox,
//   ComboboxButton,
//   ComboboxInput,
//   ComboboxOption,
//   ComboboxOptions,
// } from "@headlessui/react";

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

const RmClientsPage: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const [searchParams] = useSearchParams();
  const { rmName = "" } = useParams();

  const { addBreadcrumb } = useBreadcrumbs();

  const rmId = searchParams.get("rmId");

  const itemsPerPage = 10;
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    rmId: rmId ?? "",
    search: "",
    sortDir: "",
  });
  const navigate = useNavigate();
  const [openRmSearchDropdown, setOpenRmSearchDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      rmId: rmId ?? "",
    }));
  }, [rmId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenRmSearchDropdown(false);
      }
    };

    if (openRmSearchDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openRmSearchDropdown]);

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "client_name",
      header: () => (
        <>
          <UserIcon /> {t.table.name}
        </>
      ),
      cell: ({ row }: any) => {
        const { client_name } = row.original;
        return (
          <span
          // onClick={() =>
          //   addBreadcrumb({
          //     label: breadcrumbMapping["member-edit"],
          //     path: `/relationship-managers/member-edit?memberId=${id}`,
          //   })
          // }
          // to={`/relationship-managers/member-edit?memberId=${id}`}
          // className="text-underline"
          >
            {client_name || 'NA'}
          </span>
        );
      },
      size: 120,
    },
    {
      accessorKey: "address",
      header: () => (
        <>
          <LocationIcon /> {t.table.address}
        </>
      ),
      size: 140,
    },
    {
      accessorKey: "rm_name",
      header: () => (
        <>
          <UserIcon /> {t.table.rmAssigned}
        </>
      ),
      cell: ({ row }: any) => {
        const { rm_name } = row.original;
        return <span>{rm_name}</span>;
      },
      size: 120,
    },
    {
      accessorKey: "project_count",
      header: () => (
        <>
          <TrendingIcon /> {t.table.projects}
        </>
      ),
      cell: ({ row }: any) => {
        const { id, project_count, client_name } = row.original;
        return (
          <div className="text-center">
            <NavLink
              onClick={() =>
                addBreadcrumb({
                  label: client_name || "NA",
                  path: `/relationship-managers/${encodeURIComponent(
                    rmName
                  )}/${encodeURIComponent(client_name ? client_name : 'NA' )}?memberId=${id}`,
                })
              }
              to={`/relationship-managers/${encodeURIComponent(
                rmName
              )}/${encodeURIComponent(client_name ? client_name : 'NA')}?memberId=${id}`}
              className="text-underline"
            >
              {project_count}
            </NavLink>
          </div>
        );
      },
      size: 80,
    },
    {
      id: "action",
      header: () => (
        <>
          <ActionIcon /> {t.table.action}
        </>
      ),
      cell: ({ row }: any) => {
        const { id, client_name } = row.original;
        return (
          <NavLink
            onClick={() =>
              addBreadcrumb({
                label: client_name || 'NA',
                path: `/relationship-managers/${encodeURIComponent(
                  rmName
                )}/${encodeURIComponent(
                  client_name ? client_name : 'NA'
                )}/parameters?clientId=${id}&clientName=${encodeURIComponent(
                  client_name ? client_name : 'NA'
                )}`,
              })
            }
            to={`/relationship-managers/${encodeURIComponent(
              rmName
            )}/${encodeURIComponent(
             client_name ? client_name : 'NA'
            )}/parameters?clientId=${id}&clientName=${encodeURIComponent(
             client_name ? client_name : 'NA'
            )}`}
            style={{ display: "flex", justifyContent: "center", width: "50%" }}
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

  const { data: rmNamesList } = useQuery({
    queryKey: ["rmNamesList", selectedLang],
    queryFn: () => getRMNames(selectedLang),
  });

  const { data: clientList } = useQuery({
    queryKey: ["rmClientList", queryParams, selectedLang],
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
  const sortFn = useCallback((dir: SortingState) => {
    const sort = dir[0];

    const dirLabel = sort ? (sort.desc ? "desc" : "asc") : null;

    setQueryParams((prev) => {
      if (prev.sortDir === dirLabel) {
        return prev;
      }
      return { ...prev, sort: dir[0]?.id ? `${dir[0]?.id}:${dirLabel}` : "" };
    });
  }, []);

  return (
    <div className="rm-member-list-page">
      <div className="buttons">
        <div className="d-flex">
          <BackButton title="Back" />
          <h4>{t.heading.memberList}</h4>
        </div>

        <section>
          <SearchComponent
            placeholder={`${t.buttons.search}...`}
            onSearch={(value) => debouncedSearch(value || "")}
          />
          {/* <Combobox
            value={rmName}
            onKeyDown={(e) => {
              console.log(e, "r");
            }}
            onChange={(event) => {
              if (event) {
                console.log(event);
                //  navigate(
                //             `/relationship-managers/rm?rmId=${event}&rmName=${name}`,
                //             {
                //               replace: true,
                //             }
                //           );
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
                aria-label="Member"
                placeholder="Select a member"
              />
              <DownArrow height={16} width={16} />
            </ComboboxButton>

            <ComboboxOptions anchor="bottom" className="combobox-options">
              {rmNamesList
                ?.filter((rm: any) => {
                  return rm.id !== parseInt(rmId ?? "0");
                })
                .map((rm: any, index: number) => {
                  const name = `${rm.first_name} ${(
                    rm.last_name ?? ""
                  ).trim()}`.trim();
                  return (
                    <ComboboxOption
                      key={index}
                      value={name}
                      className="combobox-option"
                    >
                      {name}
                    </ComboboxOption>
                  );
                })}
            </ComboboxOptions>
          </Combobox> */}
          <div className="parameter-dropdown-container" ref={dropdownRef}>
            <button
              className="parameter-dropdown-button"
              onClick={() => setOpenRmSearchDropdown(!openRmSearchDropdown)}
            >
              <p>{rmName}</p>
              <DownArrow width={20} height={20} />
            </button>
            {openRmSearchDropdown && (
              <div className="dropdown-view">
                {rmNamesList
                  .filter((rm: any) => {
                    return rm.id !== parseInt(rmId ?? "0");
                  })
                  .map((rm: any, index: number) => {
                    const name = `${rm.first_name} ${(
                      rm.last_name ?? ""
                    ).trim()}`.trim();
                    return (
                      <button
                        key={index}
                        className="parameter-dropdown-button option-button"
                        onClick={() => {
                          navigate(
                            `/relationship-managers/rm?rmId=${rm.id}&rmName=${name}`,
                            {
                              replace: true,
                            }
                          );
                          // addBreadcrumb({
                          //   label: name,
                          //   path: `/relationship-managers/rm?rmId=${rm.id}&rmName=${encodeURIComponent(name)}`,
                          // });
                        }}
                      >
                        <p>{name}</p>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Table
      pageIndex={queryParams.page}
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

export default RmClientsPage;

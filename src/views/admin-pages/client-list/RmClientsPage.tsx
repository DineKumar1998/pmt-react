import UserIcon from "@/views/components/icons/table/User";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { getClientList } from '@/apis/client';
import { getRMNames } from "@/apis/rm";
import Button from "@/views/components/button";
import BackArrow from "@/views/components/icons/BackArrow";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import ClockIcon from "@/views/components/icons/table/Clock";
import TrendingIcon from "@/views/components/icons/table/Trending";
import ActionIcon from "@/views/components/icons/table/Action";
import EditIcon from "@/views/components/icons/Edit";
import DownArrow from "@/views/components/icons/DownArrow";
import "./index.scss";

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
    const rmId = searchParams.get("rmId")
    const rmName = searchParams.get("rmName")

    const itemsPerPage = 10;
    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: itemsPerPage,
        rmId: rmId ?? "",
        search: "",
    });
    const navigate = useNavigate()
    const [openRmSearchDropdown, setOpenRmSearchDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        setQueryParams((prev) => ({
            ...prev,
            page: 1,
            rmId: rmId ?? ""
        }));
    }, [rmId])

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
            accessorKey: "id",
            header: () => (
                <>
                    <ProfileWithOptionsIcon /> {t.table.id}
                </>
            ),
            size: 40
        },
        {
            accessorKey: "client_name",
            header: () => (
                <>
                    <UserIcon /> {t.table.name}
                </>
            ),
            cell: ({ row }: any) => {
                const { id, client_name } = row.original;
                return <NavLink to={`/client-list/edit-client/${id}`} className="text-underline">
                    {client_name}
                </NavLink>
            },
            size: 120
        },
        {
            accessorKey: "address",
            header: () => (
                <>
                    <LocationIcon /> {t.table.address}
                </>
            ),
            size: 140
        },
        {
            accessorKey: "assigned_date",
            header: () => (
                <>
                    <ClockIcon /> {t.table.assignDate}
                </>
            ),
            size: 120
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
                return <span>
                    {rm_name}
                </span>;
            },
            size: 120
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
                return <div>
                    <NavLink to={`/client-list/projects?clientId=${id}&clientName=${client_name}`} className="text-underline">
                        {project_count}
                    </NavLink>
                </div>;
            },
            size: 80
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
                return <NavLink to={`/manage-parameters/client?clientId=${id}&clientName=${client_name}`} style={{ display: "flex", justifyContent: "center", width: "50%" }}>
                    <EditIcon width={18} height={18} />
                </NavLink>
            },
            size: 80
        },
    ];

    const handlePageChange = (pageIndex: number) => {
        console.log("Page changed to:", pageIndex);
        setQueryParams((prev) => ({
            ...prev,
            page: pageIndex,
        }));
    };

    const { data: rmNamesList } = useQuery({
        queryKey: ['rmNamesList', selectedLang],
        queryFn: () =>
            getRMNames(selectedLang),
    });

    const { data: clientList } = useQuery({
        queryKey: ["rmClientList", queryParams, selectedLang],
        queryFn: () =>
            getClientList({ ...queryParams, language: selectedLang })
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
                rm_name: `${rm_first_name} ${(rm_last_name ?? '').trim()}`.trim(),
                assigned_date: assigned_date
                    ? new Date(assigned_date).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })
                    : null,
            })
        );
    }

    const backButtonHandler = () => {
        console.log("Back button clicked");
        navigate(-1);
    };
    return (
        <div className="client-list-page">
            <div className="buttons">
                <Button
                    text={t.buttons.back}
                    icon={<BackArrow />}
                    onClick={backButtonHandler}
                    className="mr-1"
                />
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
                <div className="parameter-dropdown-container" ref={dropdownRef}>
                    <button
                        className="parameter-dropdown-button"
                        onClick={() => setOpenRmSearchDropdown(!openRmSearchDropdown)}
                    >
                        <p>{rmName}</p>
                        <DownArrow width={20} height={20} />
                    </button>
                    {
                        openRmSearchDropdown && (
                            <div className="dropdown-view">
                                {
                                    rmNamesList
                                        .filter(
                                            (rm: any) => {
                                                return rm.id !== parseInt(rmId ?? "0")
                                            }
                                        )
                                        .map(((rm: any, index: number) => {
                                            const name = `${rm.first_name} ${(rm.last_name ?? '').trim()}`.trim();
                                            return <button
                                                key={index}
                                                className="parameter-dropdown-button option-button"
                                                onClick={() => {
                                                    navigate(
                                                        `/relationship-managers/rm?rmId=${rm.id}&rmName=${name}`, {
                                                        replace: true
                                                    }
                                                    );
                                                }}
                                            >
                                                <p>{name}</p>
                                            </button>
                                        }
                                        ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            <Table
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

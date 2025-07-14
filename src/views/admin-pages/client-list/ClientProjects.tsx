import UserIcon from "@/views/components/icons/table/User";
import ProfileWithOptionsIcon from "@/views/components/icons/table/ProfileWithOptions";
import BagIcon from "@/views/components/icons/table/Bag";
import LocationIcon from "@/views/components/icons/table/Locatiion";
import ActionIcon from "@/views/components/icons/table/Action";
import WeightIcon from "@/views/components/icons/table/Weight";
import SearchComponent from "@/views/components/Search";
import Table from "@/views/components/table";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRMClientProjects } from "@/apis/client";
import Button from "@/views/components/button";
import BackArrow from "@/views/components/icons/BackArrow";
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

const ClientProjects: React.FC = () => {
    const { selectedLang } = useLang();
    const t = translations[selectedLang];
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get("clientId")
    const clientName = searchParams.get("clientName")
    const navigate = useNavigate()
    const itemsPerPage = 10;
    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: itemsPerPage,
        search: "",
    });

    const columns: any = [
        {
            accessorKey: "id",
            header: () => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ProfileWithOptionsIcon /> {t.table.projectCode}
                </div>
            ),
            size: 80,
        },
        {
            accessorKey: "name",
            header: () => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <UserIcon /> {t.table.projectName}
                </div>
            ),
            size: 120,
        },
        {
            accessorKey: "industry",
            header: () => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <BagIcon /> {t.table.industry}
                </div>
            ),
            size: 120,
        },
        {
            accessorKey: "status",
            header: () => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <LocationIcon /> {t.table.status}
                </div>
            ),
            size: 80,
            cell: ({ row }: any) => {
                return <div>{row.original.status?.toUpperCase()}</div>;
            },
        },
        {
            id: "manageWeightage",
            header: () => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ActionIcon /> {t.table.manageWeightage}
                </div>
            ),
            size: 80,
            cell: ({ row }: any) => (
                <div style={{ display: "flex", justifyContent: "center", width: "50%" }}>
                    <WeightIcon
                        width={20}
                        height={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => openClientParametersPage(row.original.industry_id, row.original.industry)}
                    />
                </div>
            ),
        },
    ];

    const handlePageChange = (pageIndex: number) => {
        console.log("Page changed to:", pageIndex);
        setQueryParams((prev) => ({
            ...prev,
            page: pageIndex,
        }));
    };

    const { data: projectsList } = useQuery({
        queryKey: ["projectsList", queryParams, selectedLang],
        queryFn: () =>
            getRMClientProjects(+clientId!, { ...queryParams, language: selectedLang }),
        enabled: !!clientId,
    });

    const total_projects = projectsList?.totalCount ?? 0;

    let updatedProjectsList: Client[] = [];
    if (projectsList?.data?.length) {
        updatedProjectsList = projectsList.data;
    }

    const backButtonHandler = () => {
        console.log("Back button clicked");
        navigate(-1);
    };

    const openClientParametersPage = (industryId: number, industryName: string) => {
        navigate(`/manage-weightage/client?clientId=${clientId}&clientName=${clientName}&industryId=${industryId}&industryName=${industryName}`)
    }

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
            </div>
            <Table
                columns={columns}
                data={updatedProjectsList}
                itemsPerPage={itemsPerPage}
                total_rms={total_projects}
                hasNextPage={projectsList?.hasNextPage ?? false}
                onPageChange={handlePageChange}
                customColumnWidth={true}
                enableTableScroll={true}
            />
        </div>
    );
};

export default ClientProjects;

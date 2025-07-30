import Table from "@/views/components/table";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { useSearchParams } from "react-router-dom";
import ActionIcon from "@/views/components/icons/table/Action";
import { BackButton } from "@/views/components/BackButton";

import { listMcis } from "@/apis/mcis";
import Loader from "@/views/components/Loader";
import WeightIcon from "@/views/components/icons/table/Weight";

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

const ProjectMCIs: React.FC = () => {
    const { selectedLang } = useLang();
    const t = translations[selectedLang];
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId") || "";

    const [openRmSearchDropdown, setOpenRmSearchDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            accessorKey: "criterion.name",
            header: () => (
                <>
                    <ActionIcon /> {t.table.mciIndex}
                </>
            ),
            size: 120
        },
        {
            accessorKey: "weight",
            header: () => (
                <>
                    <WeightIcon /> {t.table.weight}
                </>
            ),
            size: 140
        },
    ];

    const { data: mcisList, isFetching: isMciListFetching } = useQuery({
        queryKey: ["mcis", projectId],
        queryFn: () =>
            listMcis(+projectId)
    });

    return (
        <div className="project-mci-page">

            <div className="d-flex mb-1">
                <BackButton /> <h4>PROJECT ID  : #{projectId}</h4>
            </div>

            {
                isMciListFetching ? (
                    <Loader />
                ) : <Table
                    columns={columns}
                    data={mcisList.mcis}
                    itemsPerPage={10}
                    customColumnWidth={true}
                    enableTableScroll={true}
                />
            }

        </div>
    );
};

export default ProjectMCIs;

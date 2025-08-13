import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@/views/components/BackButton";
import Loader from "@/views/components/Loader";
import Button from "@/views/components/button";
import { listMcis } from "@/apis/mcis";

import "./index.scss";

type MCI = {
    id: number;
    criterion: {
        name: string;
    };
    weight: number;
};

type FormData = {
    mcis: MCI[]; // The array of MCIs for the form
};

const ProjectMCIs: React.FC = () => {
    const { selectedLang } = useLang();
    const t = translations[selectedLang];
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const projectId = searchParams.get("projectId") || "";

    const { projectName = '' } = useParams();

    // --- Fetch MCI Data ---
    const { data: mcisData, isLoading: isMciListLoading, isError, error } = useQuery({
        queryKey: ["mcis", projectId],
        queryFn: () => listMcis(Number(projectId)),
        enabled: !!projectId,
    });

    const {
        control,
        watch,
        reset
    } = useForm<FormData>({
        defaultValues: {
            mcis: [],
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "mcis",
        keyName: "mci_id"
    });
    useEffect(() => {
        if (mcisData?.mcis) {
            reset({ mcis: mcisData.mcis });
        }
    }, [mcisData, reset]);

    if (isMciListLoading) {
        return <Loader />;
    }

    if (isError) {
        return (
            <div className="project-mci-page">
                <p>{"Failed to load MCI data."} {error?.message}</p>
                <Button text={t.buttons.goBack} onClick={() => navigate(-1)} />
            </div>
        );
    }

    return (
        <div className="project-mci-page">
            <div className="d-flex mb-1 align-items-center">
                <BackButton />
                <h4>{projectName} - #{projectId}</h4>
            </div>

            <div className="mci-grid">
                {fields.map((field, index) => (
                    <div key={field.id} className="mci-grid-item">
                        <span><strong>{field.criterion.name}</strong></span>
                        <h2>{isNaN(watch().mcis[index]?.weight) ? 0 : watch().mcis[index]?.weight}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectMCIs;

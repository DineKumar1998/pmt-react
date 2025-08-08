import React, { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form"; 
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { BackButton } from "@/views/components/BackButton";
import Loader from "@/views/components/Loader";
import Button from "@/views/components/button"; 
import { listMcis, updateMcis } from "@/apis/mcis"; 
import { toast } from "react-toastify";

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

    const { projectName = ''} = useParams();

    // --- Fetch MCI Data ---
    const { data: mcisData, isLoading: isMciListLoading, isError, error } = useQuery({
        queryKey: ["mcis", projectId],
        queryFn: () => listMcis(Number(projectId)),
        enabled: !!projectId,
    });

    const {
        control,
        handleSubmit,
        setError,
        register,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
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

    const mcis = watch("mcis");

    const totalWeight = Array.isArray(mcis) ? mcis.reduce((sum, mci) => sum + (mci?.weight ?? 0), 0) : 0;

    useEffect(() => {
        if (totalWeight > 100) {
            setError("mcis", {
                type: "manual",
                message: "Total weight cannot be greater than 100",
            });
        } else {
            clearErrors("mcis");
        }
    }, [totalWeight]);


    useEffect(() => {
        if (mcisData?.mcis) {
            console.log(mcisData.mcis)
            reset({ mcis: mcisData.mcis });
        }
    }, [mcisData, reset]);

    const mcisMutator = useMutation({
        mutationKey: ["updateProject"],
        mutationFn: (mcis: any) => updateMcis(Number(projectId), mcis),
        onSuccess(data) {
            if(data?.message) {
                return toast.success(data?.message);
            }          
        },
    });


    const onSubmit = async (data: FormData) => {
        const totalWeight = data.mcis.reduce((sum, mci) => sum + (mci.weight ?? 0), 0);
        if (totalWeight > 100) {
            setError("mcis", {
                type: "manual",
                message: "Total weight cannot be greater than 100",
            });
            return;
        }

        const actualData = data.mcis.map((mci) => ({ id: mci.id, weight: mci.weight }));

        await mcisMutator.mutateAsync({ mcis: actualData })
    };

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
<span className="note">Note* : Total Maximum weightage should be 100</span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mci-grid">
                    {fields.map((field, index) => (
                        <div key={field.id} className="mci-grid-item">
                            <div className="mci-info">
                                <div className="d-flex ">
                                    <span><strong>{field.criterion.name}</strong></span>
                                </div>

                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        {...register(`mcis.${index}.weight`,
                                            {
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Weight must be at least 0" },
                                                max: { value: 100, message: "Weight must be 100 or less" },
                                                required: true,
                                            })}
                                        className={`form-control`}
                                        step="1"
                                        aria-describedby={`weight-error-${index}`}
                                    />

                                </div>
                                {errors.mcis?.[index]?.weight && (
                                    <div id={`weight-error-${index}`} className="invalid-feedback">
                                        {errors.mcis[index]?.weight?.message}
                                    </div>
                                )}
                            </div>

                            {/* <div className="mci-handler-buttons">
                                <section className="buttons">
                                    <button
                                        type="button"
                                        className="handler-decrement"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newWeight = (field.weight ?? 0) - 1;
                                            if (newWeight >= 0) {
                                                const updatedMcis = [...fields];
                                                updatedMcis[index] = { ...field, weight: newWeight };
                                                reset({ mcis: updatedMcis });
                                            }
                                        }}
                                    >
                                        &#8722;
                                    </button>
                                    <button
                                        type="button"
                                        className="handler-increment"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newWeight = (field.weight ?? 0) + 1;
                                            if (newWeight <= 100) {
                                                const updatedMcis = [...fields];
                                                updatedMcis[index] = { ...field, weight: newWeight };
                                                reset({ mcis: updatedMcis });
                                            }
                                        }}
                                    >
                                        &#43;
                                    </button>
                                </section>
                                <h2>{isNaN(watch().mcis[index]?.weight) ? 0 : watch().mcis[index]?.weight}</h2>
                            </div> */}
                        </div>
                    ))}
                </div>

                <div className="mt-1">
                    <Button
                        type="submit"
                        onClick={() => null}
                        text={isSubmitting ? t.buttons.updating : t.buttons.updateWeights}
                        disabled={isSubmitting || !!errors.mcis}
                        className="btn-primary"
                    />
                    {errors.mcis && <span className="invalid-feedback">{errors.mcis.message}</span>}
                </div>
            </form>
        </div>
    );
};

export default ProjectMCIs;

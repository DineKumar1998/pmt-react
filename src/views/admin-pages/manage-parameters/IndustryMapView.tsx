import { getIndustryList } from "@/apis/industry";
import { getParameterById, mapParameterToIndustries } from "@/apis/parameter";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import { BackButton } from "@/views/components/BackButton";
import Button from "@/views/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useEffect } from "react";

import "./index.scss";



type FormValues = {
    industry_ids: string[]; // Checkbox values are typically strings
};

const IndustryMapView = () => {
    const { selectedLang } = useLang();
    const navigate = useNavigate();

    const t = translations[selectedLang];

    const { parameterId } = useParams();
    const [ searchParams ] = useSearchParams();

    const parameterName = searchParams.get("parameterName") || "";

    console.log(searchParams)

    // 1. Initialize React Hook Form
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            industry_ids: [],
        },
    });

    const { data: industryList } = useQuery({
        queryKey: ["industryList", selectedLang],
        queryFn: () => getIndustryList({ language: selectedLang }),
    });

    const { data: paramData } = useQuery({
        queryKey: ["paramData", parameterId, selectedLang],
        queryFn: () => getParameterById(parameterId || "", selectedLang),
    });

    useEffect(() => {
        if (paramData?.industries) {
            const mappedIndustryIds = paramData.industries.map((ind: any) =>
                String(ind.id)
            );
            reset({ industry_ids: mappedIndustryIds });
        }
    }, [paramData, reset]);


    const { mutate: mapParameterToIndustriesMutate } =
        useMutation({
            mutationFn: (body: any) => mapParameterToIndustries(parameterId ?? "", body),
            onSuccess: (data) => {
                toast.success(data?.message);
                navigate(-1);
            },
            onError: (error: any) => {
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong.";
                console.error("mapParameterToIndustriesMutate error =", message);
                toast.error(message);
            },
        });

    const onSubmit = (data: FormValues) => {

        const formattedData = {
            industry_ids: data.industry_ids.map((id) => parseInt(id))
        }

        mapParameterToIndustriesMutate(formattedData);

    }

    return <div className="industry-mapping-view">
        <div className="d-flex mb-2">
            <BackButton />
            <h3><span>Parameter: </span> {parameterName}</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="industry-grid">
                {industryList?.length
                    ?
                    industryList?.map((industry: any, index: number) => (
                        <div key={industry.id} className="industry-checkbox">
                            <input
                                type="checkbox"
                                id={`ch-${index}`}
                                {...register("industry_ids")}
                                value={industry.id}
                            />
                            <label htmlFor={`ch-${index}`} > {industry.name}</label>
                        </div>
                    ))
                    : <p>{t.text.noIndustryFound}</p>
                }
            </div>

            <div className="actions">
                <Button
                    text={t.buttons.save}
                    onClick={() => null}
                    type="submit"
                />
            </div>
        </form>

    </div>
}

export default IndustryMapView;
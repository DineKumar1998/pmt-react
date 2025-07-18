import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "@/views/components/button";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
    getParameterById,
} from "@/apis/parameter";
import { getClientParameterList } from "@/apis/parameter";
import { selectParameterOption } from "@/apis/parameter";
import { toast } from "react-toastify";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import WhiteTick from "@/views/components/icons/WhiteTick";
import "./EditClientParameter.scss";

const EditParameter = () => {
    const navigate = useNavigate();
    const { selectedLang } = useLang();

    const t = translations[selectedLang];
    const { editParamId } = useParams();
    const isEditMode = !!editParamId;

    const itemsPerPage = 10;
    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef(null);
    const itemRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});
    const location = useLocation();
    const clientId = location.state?.clientId ?? null;
    const clientName = location.state?.clientName ?? "";
    const isPrimary = location.state?.isPrimary ?? false;
    const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);



    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedData = {
            parameterId: parseInt(editParamId ?? "0"),
            optionIds: selectedOptionIds
        };

        console.log("Formatted Payload: ", formattedData);
        selectParameterOptionMutate(formattedData)
    };

    const { data: paramData } = useQuery({
        queryKey: ["paramData", editParamId, selectedLang],
        queryFn: () => getParameterById(editParamId || "", selectedLang),
        enabled: isEditMode,
    });

    const {
        data: paramList,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["paramList", selectedLang],
        queryFn: ({ pageParam = 1 }) =>
            getClientParameterList(clientId, {
                page: pageParam,
                limit: itemsPerPage,
                isPrimary: isPrimary,
                language: selectedLang,
            }),
        getNextPageParam: (lastPage: any) => {
            return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: isEditMode,
    });
    const parameterList = paramList?.pages.flatMap((page: any) => page.data) || [];
    const selectedIndex = parameterList.findIndex(
        (param) => param.id === Number(editParamId)
    );



    useEffect(() => {
        if (paramData) {
            console.log("paramData loaded:", paramData);
            const selectedList = paramData.options
                ?.filter((option: any) => option.is_selected)
                .map((option: any) => option.id) || [];
            setSelectedOptionIds(selectedList);
        }
    }, [paramData]);

    const hasScrolledRef = useRef(false);
    const triedFetchingRef = useRef(false);

    useEffect(() => {
        // Match height of parameter listing view to form view
        if (leftRef.current && rightRef.current) {
            const height = leftRef.current.offsetHeight;
            rightRef.current.style.height = `${height}px`;
        }

        if (!editParamId || hasScrolledRef.current) return;

        const paramId = Number(editParamId);

        const tryScrollToItem = async () => {
            const exists = parameterList.some((param) => param.id === paramId);
            console.log("exists =", exists);

            if (exists && itemRefs.current[paramId]) {
                itemRefs.current[paramId]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                hasScrolledRef.current = true;
                return;
            }

            if (hasNextPage && !triedFetchingRef.current) {
                triedFetchingRef.current = true;
                console.log("fetchNextPage 1");
                await fetchNextPage();
                triedFetchingRef.current = false;
            }
        };

        tryScrollToItem();
    }, [parameterList, editParamId]);

    useEffect(() => {
        //Call pagination api on scroll
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    console.log("fetchNextPage 2");
                    fetchNextPage();
                }
            },
            { threshold: 1 },
        );

        observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [loadMoreRef.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleNavigateParam = (direction: "prev" | "next") => {
        if (selectedIndex === -1) return;

        const newIndex =
            direction === "prev" ? selectedIndex - 1 : selectedIndex + 1;

        if (
            newIndex >= parameterList.length &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            console.log("fetchNextPage 3");
            fetchNextPage();
            return;
        }

        // Prevent out-of-bounds
        if (newIndex < 0 || newIndex >= parameterList.length) return;

        const nextParam = parameterList[newIndex];
        navigate(`/manage-parameters/client/edit-parameter/${nextParam.id}?clientName=${clientName}`, {
            state: {
                clientId: clientId,
                clientName: clientName,
                isPrimary: isPrimary,
            },
            replace: true,
        });

        // Scroll into view
        itemRefs.current[nextParam.id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    const toggleOption = (optionId: number) => {
        setSelectedOptionIds((prev) =>
            prev.includes(optionId)
                ? prev.filter((id: number) => id !== optionId) // Deselect
                : [...prev, optionId] // Select
        );
    };

    const { mutate: selectParameterOptionMutate } =
        useMutation({
            mutationFn: (body: any) => selectParameterOption(body),
            onSuccess: (data) => {
                console.log("selectParameterOption success data=", data);
                toast.success(data?.message || "Parameter successfully updated");
            },
            onError: (error: any) => {
                const message = error?.message;
                console.error("selectParameterOption error =", message);
                toast.error(message);
            },
        });


    return (
        <div className="add-parameter-form">

            <div className="parent-section">
                <section className="left-section" ref={leftRef}>
                    <form onSubmit={onSubmit} className="outer-container">
                        <div className="form-container">
                            <h2>{`${paramData?.id}. ${paramData?.question}`}</h2>
                            {!paramData?.options?.length ?
                                <div className="empty-state">No options found.</div>
                                : paramData?.options?.map((option: any, index: number) => (
                                    <div
                                        key={option.id}
                                        className={`parameter-option${isPrimary ? "" : " is-editable"}`}
                                        onClick={() => isPrimary ? null : toggleOption(option.id)}
                                    >

                                        <div className="checkbox-container">

                                            {selectedOptionIds.includes(option.id) && (
                                                <WhiteTick width={17} height={17} />
                                            )}
                                        </div>

                                        <p>
                                            <span>{String.fromCharCode(65 + index)}.</span>{" "}
                                            {option.option_text}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>

                        <div className={`parent-actions ${isEditMode && parameterList.length ? 'has-actions-left' : ''}`}>
                            <div className="actions-left">
                                <button
                                    onClick={() => handleNavigateParam("prev")}
                                    disabled={selectedIndex <= 0}
                                    className="pagination-button"
                                    type="button"
                                >
                                    <BackArrow />
                                </button>
                                <button
                                    onClick={() => handleNavigateParam("next")}
                                    disabled={selectedIndex >= parameterList.length - 1 && !hasNextPage}
                                    className="pagination-button"
                                    type="button"
                                >
                                    <BackArrow />
                                </button>
                            </div>
                            <div className="actions-right">
                                <Button
                                    onClick={() => {
                                        navigate(-1);
                                    }
                                    }
                                    text={t.buttons.back}
                                    icon={<BackArrow />}
                                    type="button"
                                />
                                <Button
                                    text={t.buttons.save}
                                    nextIcon={<BackArrow className="rotate-180" />}
                                    type="submit"
                                    disabled={isPrimary}
                                    onClick={() => null}
                                />
                            </div>
                        </div>
                    </form>
                </section>
                {parameterList.length ?
                    <section className="parameters-list" ref={rightRef}>
                        <ul>
                            {parameterList.map((parameter) =>
                                <li
                                    key={parameter.id}
                                    ref={(el) => {
                                        itemRefs.current[parameter.id] = el;
                                    }}
                                    onClick={() => {
                                        navigate(`/manage-parameters/client/edit-parameter/${parameter.id}?clientName=${clientName}`, {
                                            state: {
                                                clientId: clientId,
                                                clientName: clientName,
                                                isPrimary: isPrimary,
                                            },
                                            replace: true,
                                        })
                                    }}
                                    className={parameter.id === Number(editParamId) ? "selected-param" : ""}
                                >
                                    {parameter.id}. {parameter?.question}
                                </li>
                            )}
                        </ul>
                        <div ref={loadMoreRef}></div>
                    </section> : null}
            </div>



        </div>
    );
};

export default EditParameter;

import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import Button from "@/views/components/button";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getClientSelectedParameters,
  getParameterById,
} from "@/apis/parameter";
import { getClientParameterList } from "@/apis/parameter";
import { selectParameterOption } from "@/apis/parameter";
import { toast } from "react-toastify";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import { useForm } from "react-hook-form";
import Loader from "@/views/components/Loader";
import "./EditClientParameter.scss";

interface SelectedOption {
  selected_option_id: number;
  // Add other properties if they exist
}

interface ParameterOption {
  id: number;
  option_text: string;
  is_selected?: boolean;
}

interface Parameter {
  id: number;
  question: string;
  options?: ParameterOption[];
}

interface ParameterListItem {
  id: number;
  question: string;
}

const EditParameter = () => {
  const navigate = useNavigate();
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const { paramId } = useParams();
  const isEditMode = !!paramId;

  const itemsPerPage = 10;
  const loadMoreRef = useRef(null);
  const itemRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const clientId =
    (location.state?.clientId || searchParams.get("clientId")) ?? null;
  const clientName =
    location.state?.clientName ?? location.pathname.split("/")?.[2] ?? "";
  const memberName =
    location.state?.memberName ?? location.pathname.split("/")?.[3] ?? "";
  const isPrimary = location.state?.isPrimary ?? false;
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch parameter data
  const { data: paramData, isLoading: isParamLoading } = useQuery<Parameter>({
    queryKey: ["paramData", paramId, selectedLang],
    queryFn: () => getParameterById(paramId || "", selectedLang),
    enabled: isEditMode,
  });

  // Fetch selected parameters for client
  const {
    data: selectedData,
    isLoading: isSelectedLoading,
    refetch,
  } = useQuery<SelectedOption[]>({
    queryKey: ["selectedParams", paramId, clientId],
    queryFn: () => getClientSelectedParameters(clientId!, { paramId }),
    enabled: isEditMode && !!paramId && !!clientId,
  });

  const { register, handleSubmit, reset, getValues, setValue } =
    useForm<{
      selectedOptions: number[];
    }>({
      defaultValues: {
        selectedOptions: [],
      },
    });

  // Initialize form with selected options
  useEffect(() => {
    if (!isSelectedLoading && selectedData && isInitialLoad) {
      const ids = selectedData.map((i) => +i.selected_option_id);
      reset({
        selectedOptions: ids,
      });
      setIsInitialLoad(false);
    }
  }, [selectedData, isSelectedLoading, reset, isInitialLoad]);

  // Fetch parameter list for sidebar
  const {
    data: paramList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isParamListLoading,
  } = useInfiniteQuery({
    queryKey: ["paramList", selectedLang, clientId, isPrimary],
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

  const parameterList =
    paramList?.pages.flatMap((page: any) => page.data) || [];
  const selectedIndex = parameterList.findIndex(
    (param: ParameterListItem) => param.id === Number(paramId)
  );

  // Scroll to selected parameter
  const hasScrolledRef = useRef(false);
  const triedFetchingRef = useRef(false);

  useEffect(() => {
    if (!paramId || hasScrolledRef.current) return;

    const tryScrollToItem = async () => {
      const exists = parameterList.some(
        (param: ParameterListItem) => param.id === Number(paramId)
      );

      if (exists && itemRefs.current[Number(paramId)]) {
        itemRefs.current[Number(paramId)]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        hasScrolledRef.current = true;
        return;
      }

      if (hasNextPage && !triedFetchingRef.current) {
        triedFetchingRef.current = true;
        await fetchNextPage();
        triedFetchingRef.current = false;
      }
    };

    tryScrollToItem();
  }, [parameterList, paramId, fetchNextPage, hasNextPage]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Navigation between parameters
  const handleNavigateParam = (direction: "prev" | "next") => {
    if (selectedIndex === -1) return;

    const newIndex =
      direction === "prev" ? selectedIndex - 1 : selectedIndex + 1;

    if (
      newIndex >= parameterList.length &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
      return;
    }

    if (newIndex < 0 || newIndex >= parameterList.length) return;

    const nextParam = parameterList[newIndex];
    navigate(
      `/relationship-managers/${clientName}/${memberName}/parameters/${nextParam.id}?clientId=${clientId}`,
      {
        state: {
          clientId: clientId,
          clientName: clientName,
          isPrimary: isPrimary,
        },
        replace: true,
      }
    );

    itemRefs.current[nextParam.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Mutation for saving parameter options
  const { mutate: selectParameterOptionMutate, isPending: isSaving } =
    useMutation({
      mutationFn: (body: any) => selectParameterOption(body),
      onSuccess: (data) => {
        refetch();
        toast.success(data?.message || "Parameter successfully updated");
      },
      onError: (error: any) => {
        const message = error?.message || "Failed to update parameter";
        console.error("selectParameterOption error =", message);
        toast.error(message);
      },
    });

  // Form submission handler
  const onSubmit = (data: { selectedOptions: number[] }) => {
    if (!paramId || !clientId) return;

    const formattedData = {
      parameterId: parseInt(paramId),
      optionIds: data.selectedOptions,
      clientId: parseInt(clientId),
    };

    selectParameterOptionMutate(formattedData);
  };

  if (isParamLoading || isSelectedLoading || isParamListLoading) {
    return <Loader />;
  }

  return (
    <div className="edit-client-parameter-page">
      <div className="parent-section">
        <section className="left-section">
          <form onSubmit={handleSubmit(onSubmit)} className="outer-container">
            <div className="form-container">
              <h2>{`${paramData?.id}. ${paramData?.question}`}</h2>

              {!paramData?.options?.length ? (
                <div className="empty-state">No options found.</div>
              ) : (
                paramData?.options?.map(
                  (option: ParameterOption, index: number) => (
                    <div
                      key={option.id}
                      className={`parameter-option ${
                        isPrimary ? "" : " is-editable"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`ch-${index}`}
                        {...register("selectedOptions")}
                        value={option.id}
                        checked={getValues("selectedOptions")?.includes(
                          option.id
                        )}
                        onChange={(e) => {
                          const currentValues = (
                            getValues("selectedOptions") || []
                          )?.map((i: any) => parseInt(i));
                          if (e.target.checked) {
                            setValue("selectedOptions", [
                              ...currentValues,
                              option.id,
                            ]);
                          } else {
                            setValue(
                              "selectedOptions",
                              currentValues.filter((id) => id !== option.id)
                            );
                          }
                        }}
                        // disabled={isPrimary}
                        className="custom-checkbox-input"
                      />

                      <label
                        htmlFor={`ch-${index}`}
                        className={`custom-checkbox-label`}
                      >
                        <span className="option-text">
                          <span className="option-letter">
                            {String.fromCharCode(65 + index)}.
                          </span>{" "}
                          {option.option_text}
                        </span>
                      </label>
                    </div>
                  )
                )
              )}
            </div>

            <div
              className={`parent-actions ${
                isEditMode && parameterList.length ? "has-actions-left" : ""
              }`}
            >
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
                  disabled={
                    selectedIndex >= parameterList.length - 1 && !hasNextPage
                  }
                  className="pagination-button next-button"
                  type="button"
                >
                  <BackArrow />
                </button>
              </div>
              <div className="actions-right">
                <Button
                  onClick={() => navigate(-1)}
                  text={t.buttons.back}
                  icon={<BackArrow />}
                  type="button"
                />
                <Button
                  onClick={() => {}}
                  text={isSaving ? t.buttons.saving : t.buttons.save}
                  type="submit"
                  // disabled={isPrimary || isSaving}
                  disabled={isSaving}
                />
              </div>
            </div>
          </form>
        </section>

        {parameterList.length > 0 && (
          <section className="parameters-list">
            <ul>
              {parameterList.map((parameter: ParameterListItem) => (
                <li
                  key={parameter.id}
                  ref={(el) => {
                    itemRefs.current[parameter.id] = el;
                  }}
                  onClick={() => {
                    navigate(
                      `/relationship-managers/${clientName}/${memberName}/parameters/${parameter.id}?clientId=${clientId}`,
                      {
                        state: {
                          clientId: clientId,
                          clientName: clientName,
                          isPrimary: isPrimary,
                        },
                      }
                    );
                  }}
                  className={
                    parameter.id === Number(paramId) ? "selected-param" : ""
                  }
                >
                  {parameter.id}. {parameter.question}
                </li>
              ))}
            </ul>
            <div ref={loadMoreRef}></div>
            {isFetchingNextPage && (
              <div className="loading-more">
                <Loader />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default EditParameter;

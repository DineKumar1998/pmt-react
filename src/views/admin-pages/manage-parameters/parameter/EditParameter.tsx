import { useState, useEffect, useRef, useMemo } from "react";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import FilterIcon from "@assets/icons/Filter.svg";
import CrossIcon from "@assets/icons/Cross.svg";
import {
  getParameterById,
  editParameter,
  deleteParameterIndustryMapping,
  getParameterQuestions,
} from "@/apis/parameter";

import { ParameterForm, type FormValues } from "./ParameterForm"; // Import the reusable form
import Button from "@/views/components/button";
import { BackButton } from "@/views/components/BackButton";
import CustomModal from "@/views/components/modal";

import BackArrow from "@/views/components/icons/BackArrow";

import "../index.scss";

type Industry = { id: number; name: string };

const EditParameter = () => {
  const { selectedLang } = useLang();
  const { editParamId } = useParams<{ editParamId: string }>();

  const [searchParams] = useSearchParams();

  const [language, setLanguage] = useState<"en" | "jp">("en");
  const t = translations[language];

  const [selectedIndustryList, setSelectedIndustryList] = useState<Industry[]>(
    []
  );
  const [state, setState] = useState<{
    isOpen: boolean;
    selectedIndustryId: null | number;
  }>({
    isOpen: false,
    selectedIndustryId: null,
  });

  const navigate = useNavigate();
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef(null);
  const itemRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});

  const { data: paramData } = useQuery({
    queryKey: ["paramData", editParamId, selectedLang],
    queryFn: () => getParameterById(editParamId!, selectedLang),
    enabled: !!editParamId,
  });

  const {
    data: paramList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["paramList", selectedLang],
    queryFn: ({ pageParam = 1 }) =>
      getParameterQuestions({
        page: pageParam,
        pageSize: 10,
        isPrimary: searchParams.get('isPrimary')==="true",
        language: selectedLang,
      }),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const { mutate: editParameterMutate, isPending } = useMutation({
    mutationFn: (body: any) => editParameter(editParamId!, body),
    onSuccess: (data) => toast.success(data?.message),
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Something went wrong."),
  });

  const { mutateAsync: deleteParameterIndustryMappingMutate } = useMutation({
    mutationFn: (industryId: number) =>
      deleteParameterIndustryMapping(editParamId || "", industryId),
    onSuccess: (_data, industryId) => {
      const newSelected = selectedIndustryList.filter(
        (ind) => ind.id !== industryId
      );
      setSelectedIndustryList(newSelected);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      console.error("deleteParameterIndustryMapping error =", message);
      toast.error(message);
    },
  });

  const parameterList =
    paramList?.pages.flatMap((page: any) => page.data) || [];
  const selectedIndex = parameterList.findIndex(
    (param) => param.id === Number(editParamId)
  );

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      question: data.parameter || paramData.question,
      options: data.options,
      language,
    };
    editParameterMutate(formattedData);
  };

  // Memoize initial values to prevent unnecessary re-renders of the form
  const initialValues = useMemo(() => {
    if (!paramData) return undefined;

    const formattedOptions = paramData.options?.map(
      (opt: any, index: number) => ({
        id: opt.id,
        option_text: opt.option_text,
        self_rating: Number(opt.self_rating ?? 0),
        display_order: opt.display_order || index + 1,
      })
    );

    return {
      parameter: paramData.question,
      options: formattedOptions,
    };
  }, [paramData]);

  useEffect(() => {
    if (paramData?.industries?.length) {
      setSelectedIndustryList(paramData.industries);
    } else {
      setSelectedIndustryList([]);
    }
  }, [paramData]);

  // All other hooks and logic for side panel, infinite scroll, etc. remain here...
  // ... (useInfiniteQuery, other mutations, useEffects for scrolling, etc.)

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

    // Prevent out-of-bounds
    if (newIndex < 0 || newIndex >= parameterList.length) return;

    const nextParam = parameterList[newIndex];
    navigate(`/manage-parameters/${nextParam.id}?isPrimary=${searchParams.get('isPrimary') || false}`, {
      replace: true,
    });

    // Scroll into view
    itemRefs.current[nextParam.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const actions = (
    <div className="parent-actions">
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
        <NavLink
          to={`/manage-parameters/${editParamId}/industry-map?parameterName=${encodeURIComponent(
            paramData?.question
          )}`}
        >
          <Button
            className="generate-password"
            text={t.buttons.manageIndustryMapping}
            type="button"
            onClick={() => null}
            disabled={!editParamId}
          />
        </NavLink>
        <Button
          text={t.buttons.save}
          type="submit"
          onClick={() => null}
          disabled={isPending}
        />
      </div>
    </div>
  );

  return (
    <div className="edit-parameter-form">
      <div className="parent-section">
        <section className="left-section" ref={leftRef}>
          <div className="d-flex">
            <BackButton backHandler={()=>{
                navigate('/manage-parameters')
            }} title=" " />
            <h2>{t.heading.editParameter}</h2>
          </div>
          <div className="language-buttons">
            <Button
              text="English"
              onClick={() => setLanguage("en")}
              className={language === "en" ? "" : "back-btn"}
            />
            <Button
              text="日本語"
              onClick={() => setLanguage("jp")}
              className={language === "jp" ? "" : "back-btn"}
            />
          </div>

          {selectedIndustryList?.length > 0 && (
            <div className="mt-1">
              <p>{t.heading.industry}</p>
              <div className={`industry-list-view `}>
                {/* <div className={`industry-list-view ${paramData?.is_primary && 'disabled'}`}> */}
                <img
                  src={FilterIcon}
                  alt="Filter Icon"
                  style={{ marginRight: "10px" }}
                />
                {selectedIndustryList?.map((industry: any) => (
                  <div className="industry-item" key={industry.id}>
                    <p>{industry.name}</p>
                    {
                      <img
                        src={CrossIcon}
                        alt="Cross Icon"
                        style={{ marginLeft: "5px", cursor: "pointer" }}
                        onClick={() => {
                          setState(() => ({
                            selectedIndustryId: industry.id,
                            isOpen: true,
                          }));
                        }}
                      />
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          <ParameterForm
            isPrimary={paramData?.is_primary}
            onSubmit={onSubmit}
            isEditMode={true}
            initialValues={initialValues}
            disableParamEditing={false}
            language={language}
            actions={actions}
          />
        </section>

        <section className="parameters-list" ref={rightRef}>
          <ul>
            {parameterList.map((parameter) => (
              <li
                key={parameter.id}
                ref={(el) => {
                  itemRefs.current[parameter.id] = el;
                }}
                className={
                  parameter.id === Number(editParamId) ? "selected-param" : ""
                }
              >
                <NavLink to={`/manage-parameters/${parameter.id}?isPrimary=${searchParams.get('isPrimary') || false}`}>
                  {parameter.id}. {parameter?.question}
                </NavLink>
              </li>
            ))}
          </ul>
          <div ref={loadMoreRef}></div>
        </section>
      </div>

      <CustomModal
        isOpen={state.isOpen}
        isDanger={true}
        confirmLabel={`Delete?`}
        onClose={() => setState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={async () => {
          if (state.selectedIndustryId) {
            await deleteParameterIndustryMappingMutate(
              state.selectedIndustryId
            );
            setState((prev) => ({ ...prev, isOpen: false }));
            return toast.success("Industry has been deleted successfully.");
          }
        }}
        title="Confirm Industry Delete?"
        description="Are you sure you want to delete the industry? This action cannot be undone."
      />
    </div>
  );
};

export default EditParameter;

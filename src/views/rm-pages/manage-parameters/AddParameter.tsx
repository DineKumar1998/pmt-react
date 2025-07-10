import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParameterField from "@/views/components/ParameterField";
import ConfirmationModal from "@/views/components/ConfirmationModel";
import Button from "@/views/components/button";
import AddCircle from "@/views/components/icons/AddCircle";

// Import use-form-hook
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  createParameter,
  mapParameterToIndustries,
  getParameterById,
  deleteParameterIndustryMapping,
  editParameter,
  getParameterQuestions
} from "@/apis/parameter";
import { getIndustryList } from "@/apis/industry";
import { toast } from "react-toastify";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import FilterIcon from "@assets/icons/Filter.svg";
import CrossIcon from "@assets/icons/Cross.svg";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ParameterSortableItem } from "@/views/components/ParameterSortableItem";
import BackArrow from "@/views/components/icons/BackArrow";
import "./ParameterIndex.scss";


type FormValues = {
  parameter: string;
  options: {
    id?: number; // Optional: will be present only during edit
    option_text: string;
    self_rating: number;
    display_order: number;
  }[];
  rating: number | "";
};

const AddParameter = () => {
  const navigate = useNavigate();
  const { selectedLang } = useLang();
  const [language, setLanguage] = React.useState<"en" | "jp" | null>(null);

  const t = translations[language || selectedLang];
  const { editParamId } = useParams();
  const isEditMode = !!editParamId;

  const [showIndustryMappingView, setShowIndustryMappingView] = useState(false);
  type Industry = { id: number; name: string };
  const [selectedIndustryList, setSelectedIndustryList] = useState<Industry[]>([]);
  const [disableIndustryMapping, setDisableIndustryMapping] = useState(true);
  const [disableParamEditing, setDisableParamEditing] = useState(false);
  const [parameterId, setParameterId] = useState(0);
  const [selectedIndustryToDelete, setSelectedIndustryToDelete] = useState<any>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const itemsPerPage = 10;
  // const [queryParams, _setQueryParams] = useState({
  //   page: 1,
  //   pageSize: itemsPerPage,
  //   isPrimary: false,
  // });
  // type Parameter = {
  //   id: number;
  //   question: string;
  //   // Add other fields if needed
  // };
  // const [parameterList, setParameterList] = useState<Parameter[]>([]);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef(null);
  const itemRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});


  const handleLanguageChange = (lang: "en" | "jp") => {
    setLanguage(lang);
  };

  // const _handleGeneratePassword = () => {
  //   alert("Generate Password clicked!");
  // };

  // useForm hook
  const {
    control,
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      parameter: "",
      options: [{ option_text: "", self_rating: 0, display_order: 1 }],
    },
  });

  // useFieldArray for options
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "options",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex); // useForm's useFieldArray move function

      // After moving, update the display_order manually
      setTimeout(() => {
        const currentValues = getValues(); // Get all current form values
        const updatedOptions = currentValues.options.map((option, index) => ({
          ...option,
          display_order: index + 1,
        }));
        reset({
          ...currentValues,
          options: updatedOptions,
        });
      }, 0);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    //create parameter
    const formattedData = {
      question: data.parameter,
      options: data.options,
      language
    };

    console.log("Formatted Payload: ", formattedData);
    if (isEditMode) {
      editParameterMutate(formattedData);
    } else {
      createParameterMutate(formattedData);
    }

  };

  const handleIndustryMapping = () => {
    const selectedIndustryIds = selectedIndustryList.map(
      (industry) => industry.id,
    );
    const formattedData = {
      industry_ids: selectedIndustryIds,
    };
    console.log("Formatted Payload: ", formattedData);
    mapParameterToIndustriesMutate(formattedData);
  }

  const { mutate: createParameterMutate } =
    useMutation({
      mutationFn: (body: any) => createParameter(body),
      onSuccess: (data) => {
        console.log("createParameter success data=", data);
        toast.success(data?.message);
        setParameterId(data?.paramId);
        setDisableIndustryMapping(false);
        setDisableParamEditing(true);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.";
        console.error("createParameter error =", message);
        toast.error(message);
      },
    });

  const { mutate: editParameterMutate } =
    useMutation({
      mutationFn: (body: any) => editParameter(editParamId || "", body),
      onSuccess: (data) => {
        console.log("editParameter success data=", data);
        toast.success(data?.message);
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.";
        console.error("createParameter error =", message);
        toast.error(message);
      },
    });

  const { mutate: mapParameterToIndustriesMutate } =
    useMutation({
      mutationFn: (body: any) => mapParameterToIndustries(isEditMode ? editParamId : parameterId, body),
      onSuccess: (data) => {
        console.log("mapParameterToIndustriesMutate success data=", data);
        toast.success(data?.message);
        navigate("/manage-parameters", {
          state: { showSecondary: true },
          replace: true,
        });
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

  const { data: industryList } = useQuery({
    queryKey: ["industryList", selectedLang],
    queryFn: () => getIndustryList({ language: selectedLang }),
  });

  const { data: paramData } = useQuery({
    queryKey: ["paramData", editParamId, selectedLang],
    queryFn: () => getParameterById(editParamId || "", selectedLang),
    enabled: isEditMode,
  });

  // const { data: paramList } = useQuery({
  //   queryKey: ["paramList", queryParams, selectedLang],
  //   queryFn: () => getParameterQuestions({ ...queryParams, language: selectedLang }),
  //   enabled: isEditMode,
  // });
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
        pageSize: itemsPerPage,
        isPrimary: false,
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

  const { mutate: deleteParameterIndustryMappingMutate } =
    useMutation({
      mutationFn: (industryId: number) => deleteParameterIndustryMapping(editParamId || "", industryId),
      onSuccess: (data, industryId) => {
        console.log("deleteParameterIndustryMapping success data=", data);
        const newSelected = selectedIndustryList.filter(
          (ind) => ind.id !== industryId,
        );
        setSelectedIndustryList(newSelected);
        toast.success(data?.message);
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

  useEffect(() => {
    if (paramData) {
      console.log("paramData loaded:", paramData);

      // Set industries for display
      setSelectedIndustryList([]);
      if (paramData.industries?.length) {
        setSelectedIndustryList(paramData.industries)
      }

      // Prepare options for reset
      const formattedOptions = paramData.options?.map((opt: any, index: number) => ({
        id: opt.id,
        option_text: opt.option_text,
        self_rating: Number(opt.self_rating ?? 0),
        display_order: opt.display_order || index + 1,
      }));
      reset({
        parameter: paramData.question,
        options: formattedOptions,
      });

      // Enable industry mapping for edit mode
      setDisableIndustryMapping(false);

    }
  }, [paramData, reset]);

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
          console.log("fetchNextPage 2")
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleNavigateParam = (direction: "prev" | "next") => {
    if (selectedIndex === -1) return;

    const newIndex = direction === "prev" ? selectedIndex - 1 : selectedIndex + 1;

    if (newIndex >= parameterList.length && hasNextPage && !isFetchingNextPage) {
      console.log("fetchNextPage 3")
      fetchNextPage();
      return;
    }

    // Prevent out-of-bounds
    if (newIndex < 0 || newIndex >= parameterList.length) return;

    const nextParam = parameterList[newIndex];
    navigate(`/manage-parameters/edit-parameter/${nextParam.id}`, {
      replace: true,
    });

    // Scroll into view
    itemRefs.current[nextParam.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };


  return (
    <div className="add-parameter-form">
      {!showIndustryMappingView ? (
        <div className="parent-section">
          <section className="left-section" ref={leftRef}>
            <h2>{isEditMode ? t.heading.editParameter : t.heading.addParameter}</h2>

            <div className="language-buttons">
              <Button
                text="English"
                onClick={() => handleLanguageChange("en")}
                className={language === "en" ? "" : "back-btn"}
              />
              <Button
                text="日本語"
                onClick={() => handleLanguageChange("jp")}
                className={language === "jp" ? "" : "back-btn"}
              />
            </div>

            {isEditMode && selectedIndustryList?.length ? (
              <div className="mt-1">
                <p>{t.heading.industry}</p>
                <div className="industry-list-view">
                  <img
                    src={FilterIcon}
                    alt="Filter Icon"
                    style={{ marginRight: "10px" }}
                  />
                  {selectedIndustryList?.map((industry: any) => (
                    <div className="industry-item" key={industry.id}>
                      <p>{industry.name}</p>
                      <img
                        src={CrossIcon}
                        alt="Cross Icon"
                        style={{ marginLeft: "5px" }}
                        onClick={() => {
                          setSelectedIndustryToDelete(industry);
                          setShowConfirmationModal(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-container">
                <div className="mt-1">
                  <p>{t.heading.parameter}</p>
                  <Controller
                    control={control}
                    name="parameter"
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <ParameterField
                        {...field}
                        placeholder="Enter parameter"
                        className={errors.parameter ? "border-danger" : ""}
                        disabled={disableParamEditing}
                        showDeleteIcon={false}
                      />
                    )}
                  />
                </div>

                <div className="option-container">
                  <div className="options">
                    <div className="outer-label">
                      <div className="options-label">
                        <h4>{t.heading.options}</h4>
                        {!disableParamEditing ?
                          <span
                            className="add-option-button"
                            onClick={() =>
                              append({
                                option_text: "",
                                self_rating: 0,
                                display_order: fields.length + 1,
                              })
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <AddCircle />
                          </span> : null}
                      </div>
                      <h4 className="rating-label">{t.heading.rating}</h4>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={fields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {fields.map((option, index) => (
                          <ParameterSortableItem
                            key={option.id}
                            id={option.id}
                            index={index}
                            control={control}
                            register={register}
                            errors={errors}
                            remove={remove}
                            disabled={disableParamEditing}
                            enableDrag={!disableParamEditing}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>


                  </div>
                </div>
              </div>

              <div className={`parent-actions ${isEditMode && parameterList.length ? 'has-actions-left' : ''}`}>
                {isEditMode && parameterList.length ?
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
                  </div> : null}
                <div className="actions-right">
                  <Button
                    className="generate-password"
                    onClick={() => {
                      setShowIndustryMappingView(true)
                    }
                    }
                    text={t.buttons.manageIndustryMapping}
                    type="button"
                    disabled={disableIndustryMapping}
                  />
                  <Button
                    text={t.buttons.save}
                    type="submit"
                    disabled={disableParamEditing}
                    onClick={() => null}
                  />
                </div>
              </div>
            </form>
          </section>
          {isEditMode && parameterList.length ?
            <section className="parameters-list" ref={rightRef}>
              <ul>
                {parameterList.map((parameter) =>
                  <li
                    key={parameter.id}
                    ref={(el) => {
                      itemRefs.current[parameter.id] = el;
                    }}
                    onClick={() => {
                      navigate(`/manage-parameters/edit-parameter/${parameter.id}`, {
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

          {showConfirmationModal && selectedIndustryToDelete && (
            <ConfirmationModal
              message={`Are you sure you want to delete "${selectedIndustryToDelete.name}"?`}
              onConfirm={() => {
                deleteParameterIndustryMappingMutate(selectedIndustryToDelete.id);
                setShowConfirmationModal(false);
                setSelectedIndustryToDelete(null);
              }}
              onCancel={() => {
                setShowConfirmationModal(false);
                setSelectedIndustryToDelete(null);
              }}
            />
          )}
        </div>
      ) : (
        <div className="industry-mapping-view">
          <p>{t.text.chooseIndustry}</p>
          <div className="industry-grid">
            {industryList?.length
              ?
              industryList?.map((industry: any) => (
                <label key={industry.id} className="industry-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIndustryList.some((ind) => ind.id === industry.id)}
                    onChange={(e) => {
                      const newSelected = e.target.checked
                        ? [...selectedIndustryList, industry]
                        : selectedIndustryList.filter(
                          (ind) => ind.id !== industry.id,
                        );
                      setSelectedIndustryList(newSelected);
                    }}
                  />
                  {industry.name}
                </label>
              ))
              : <p>{t.text.noIndustryFound}</p>
            }
          </div>

          <div className="actions">
            <Button
              text={t.buttons.save}
              onClick={() => handleIndustryMapping()}
              type="button"
            />
          </div>
        </div>
      )}


    </div>
  );
};

export default AddParameter;

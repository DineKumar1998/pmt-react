import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ParameterField from "@/views/components/ParameterField";

import Button from "@/views/components/button";

// scss
import "./index.scss";
import AddCircle from "@/views/components/icons/AddCircle";

// Import use-form-hook
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
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
// import { translations } from "@/utils/translations";
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

const AddParameter = ({ label }: { label: string }) => {
  const navigate = useNavigate();
  const { selectedLang } = useLang();
  // const t = translations[selectedLang];
  const { editParamId } = useParams();
  const isEditMode = !!editParamId;

  const [language, setLanguage] = React.useState<"en" | "jp">("en");
  const [showIndustryMappingView, setShowIndustryMappingView] = useState(false);
  type Industry = { id: number; name: string };
  const [selectedIndustryList, setSelectedIndustryList] = useState<Industry[]>([]);
  const [disableIndustryMapping, setDisableIndustryMapping] = useState(true);
  const [disableParamEditing, setDisableParamEditing] = useState(false);
  const [parameterId, setParameterId] = useState(0);
  const itemsPerPage = 10;
  const [queryParams, _setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    isPrimary: false,
  });
  type Parameter = {
    id: number;
    question: string;
    // Add other fields if needed
  };
  const [parameterList, setParameterList] = useState<Parameter[]>([]);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);


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

  const { data: industryList, refetch: industryListRefetch } = useQuery({
    queryKey: ["industryList", selectedLang],
    queryFn: () => getIndustryList(selectedLang),
    enabled: false,
  });

  const { data: paramData } = useQuery({
    queryKey: ["paramData", editParamId, selectedLang],
    queryFn: () => getParameterById(editParamId || "", selectedLang),
    enabled: isEditMode,
  });

  const { data: paramList } = useQuery({
    queryKey: ["paramList", queryParams, selectedLang],
    queryFn: () => getParameterQuestions({ ...queryParams, language: selectedLang }),
    enabled: isEditMode,
  });

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

  useEffect(() => {
    if (paramList?.parameters?.length) {
      setParameterList((prev) =>
        queryParams.page === 1
          ? [...paramList.parameters] // reset
          : [...prev, ...paramList.parameters] // append
      );
    }
  }, [paramList, queryParams.page]);

  useEffect(() => {
    if (leftRef.current && rightRef.current) {
      const height = leftRef.current.offsetHeight;
      rightRef.current.style.height = `${height}px`;
    }
  }, [parameterList]);

  return (
    <div className="add-parameter-form">
      {!showIndustryMappingView ? (
        <div className="parent-section">
          <section className="left-section" ref={leftRef}>
            <h2>{label}</h2>

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
                <p>Industry</p>
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
                          deleteParameterIndustryMappingMutate(industry.id)
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
                  <p>Parameter</p>
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
                        <h4>Options</h4>
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
                      <h4 className="rating-label">Rating</h4>
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

              <div className="actions">
                <Button
                  className="generate-password"
                  onClick={() => {
                    industryListRefetch()
                    setShowIndustryMappingView(true)
                  }
                  }
                  text="Manage Industry Mapping"
                  type="button"
                  disabled={disableIndustryMapping}
                />
                <Button
                  text="Save"
                  type="submit"
                  disabled={disableParamEditing}
                  onClick={() => null}
                />
              </div>
            </form>
          </section>
          {isEditMode && parameterList.length ?
            <section className="parameters-list" ref={rightRef}>
              <ul>
                {parameterList.map((parameter, index) =>
                  <li
                    key={parameter.id}
                    onClick={() => {
                      navigate(`/manage-parameters/edit-parameter/${parameter.id}`, {
                        replace: true,
                      })
                    }}
                    className={parameter.id === Number(editParamId) ? "selected-param" : ""}
                  >
                    {index + 1}. {parameter?.question}
                  </li>
                )}
              </ul>
            </section> : null}
        </div>
      ) : (
        <div className="industry-mapping-view">
          <p>Please choose your Industry</p>
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
              : <p>No industry found</p>
            }
          </div>

          <div className="actions">
            <Button
              text="Save"
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

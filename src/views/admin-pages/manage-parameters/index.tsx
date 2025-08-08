import React, { useState, useEffect, useRef, useMemo } from "react";
import Button from "@/views/components/button";
import {
  AddCircleIcon,
  DownloadIcon,
  PlusIcon,
  Justice,
} from "@/views/components/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getParameterList,
  editParameterWeightages,
  exportParameterList,
} from "@/apis/parameter";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import { EditIcon } from "@/views/components/icons";
import { useForm, type FieldError, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { IndustryScale } from "@/utils/constants";
import DownArrow from "@/views/components/icons/DownArrow";

import "./index.scss";
import { useBreadcrumbs } from "@/context/Breadcrumb";

type FormValues = {
  parameters: {
    id: number;
    weightage: number;
  }[];
};

const ManageParametersPage: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];

  const TABS = [
    {
      key: "primary",
      label: t.buttons.primary,
    },
    {
      key: "secondary",
      label: t.buttons.secondary,
    },
  ];

  const itemsPerPage = 10;
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const industryId = searchParams.get("industryId");
  const industryName = searchParams.get("industryName");
  const selectedTab = searchParams.get("tab");
  const scale = searchParams.get("scale");
  const { addBreadcrumb } = useBreadcrumbs();

  const [activeTab, setActiveTab] = useState(() => selectedTab || TABS[0].key);
  const showIndustryWeightage = !!industryId;

  const [totalPages, setTotalPages] = useState<number>(0);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    isPrimary: activeTab === "primary",
    industry_id: industryId ?? 0,
  });

  const [selectedScale, setSelectedScale] = useState(scale || "Startup");

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      isPrimary: activeTab === "primary",
    }));
    setExpandedIds([]); // Collapse all when switching tabs
  }, [activeTab]);

  const navigate = useNavigate();

  const handleTabClick = (key: string) => {
    setActiveTab(key);

    // Update the URL search parameters
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", key);
    setSearchParams(newParams, { replace: true });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddParameter = () => {
    navigate("/manage-parameters/add-parameter");
    addBreadcrumb({
      label: "Add",
      path: "/manage-parameters/add-parameter",
    });
  };

  const handleEditParameter = (paramId: number) => {
    navigate(`/manage-parameters/${paramId}`);
    addBreadcrumb({
      label: "Edit",
      path: `/manage-parameters/${paramId}`,
    });
  };

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const handleExportParameter = () => {
    exportParameterMutate({
      isPrimary: queryParams.isPrimary,
      language: selectedLang,
    });
  };

  const { data: parameterList, refetch: parameterlistRefetch } = useQuery({
    queryKey: ["parameterList", queryParams, selectedLang],
    queryFn: () => getParameterList({ ...queryParams, language: selectedLang }),
  });

  const { mutate: exportParameterMutate } = useMutation({
    mutationFn: (body: any) => exportParameterList(body),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "parameters.xlsx"); // set your filename
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      const message = error?.message;
      console.error("exportParameterMutate error =", message);
      toast.error(message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      parameters: [],
    },
  });

  const initialValues = useRef<{ id: number; weightage: number }[]>([]);
  useEffect(() => {
    if (parameterList?.data.length) {
      const params = parameterList.data.map((param: any) => ({
        id: param.id,
        weightage: param.weightage ?? 0,
      }));
      reset({ parameters: params });
      initialValues.current = params;
      setTotalPages(Math.ceil(parameterList.totalCount / parameterList.limit));
    }
  }, [parameterList, reset]);

  // const getParameterNumber = (index: number) => {
  //   return ((queryParams.page - 1) * itemsPerPage) + (index + 1)
  // }

  const watchedParameters = useWatch({
    name: "parameters",
    control,
  });

  const isFormChanged = useMemo(() => {
    return watchedParameters?.some((param, index) => {
      const initialParam = initialValues.current?.[index];
      if (!initialParam) return false;
      if (!param.weightage) return false;
      return param.weightage !== initialParam.weightage;
    });
  }, [watchedParameters]);

  const onSubmit = (data: any) => {
    const currentValues = data.parameters;
    const changedParameters = currentValues.filter(
      (param: any, index: number) => {
        return param.weightage !== initialValues.current[index]?.weightage;
      }
    );
    const formattedData = {
      weightages: changedParameters,
    };
    editParameterWeightagesMutate(formattedData);
  };

  const onError = (errors: any) => {
    const flatErrors = Object.values(errors.parameters || {});
    if (flatErrors.length > 0) {
      const firstError = (flatErrors[0] as { weightage?: FieldError })
        ?.weightage?.message;
      if (firstError) {
        toast.error(firstError);
      }
    }
  };

  const { mutate: editParameterWeightagesMutate } = useMutation({
    mutationFn: (body: any) => editParameterWeightages(body),
    onSuccess: (_data) => {
      toast.success("Weightage successfully updated");
      parameterlistRefetch();
    },
    onError: (error: any) => {
      const message = error?.message;
      console.error("editParameterWeightages error =", message);
      toast.error(message);
    },
  });

  return (
    <div className="manage-parameters-page">
      {showIndustryWeightage && industryName ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="mb-1"
        >
          <div className="industry-name-view">
            <p>{industryName}</p>
          </div>

          <Combobox
            value={selectedScale}
            onChange={(event) => {
              if (event) {
                setSelectedScale(event);
                const scaleParam = new URLSearchParams(searchParams.toString());
                scaleParam.set("scale", event);
                setSearchParams(scaleParam);
              }
            }}
            as="div"
            className="combobox-container"
          >
            <ComboboxButton
              className="combobox-button"
              style={{ width: "200px" }}
            >
              <ComboboxInput
                className="input-field"
                aria-label="Scale"
                placeholder="Select a scale"
              />
              <DownArrow height={16} width={16} />
            </ComboboxButton>

            <ComboboxOptions anchor="bottom" className="combobox-options">
              {IndustryScale.map((scale: string, index: number) => (
                <ComboboxOption
                  key={index}
                  value={scale}
                  className="combobox-option"
                >
                  {scale}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </div>
      ) : null}

      {/* Two tabs - Primary, Secondary */}
      <div className="tabs">
        <section className="tab-list">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`tab-button ${tab.key} ${
                activeTab === tab.key ? "active" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        <div className="actions-container">
          {showIndustryWeightage ? (
            <div className="weightage-actions">
              <div className="weightage-view">
                <Justice />
                <p>{parameterList?.totalWeightage ?? 0}</p>
              </div>
              <Button
                text={t.buttons.back}
                icon={<BackArrow />}
                onClick={handleBackClick}
              />
            </div>
          ) : (
            <div className="manage-actions">
              {activeTab === "secondary" && (
                <Button
                  text={t.heading.addParameter}
                  icon={<AddCircleIcon />}
                  onClick={handleAddParameter}
                  className="add-parameter-button"
                />
              )}
              <button onClick={handleExportParameter} className="export-button">
                <DownloadIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsable List of Parameters */}
      <section className="parameters-list">
        {parameterList?.data?.length === 0 ? (
          <div className="empty-state">No parameters found.</div>
        ) : (
          <>
            <ul>
              {parameterList?.data?.map((param: any, index: number) => (
                <li
                  key={param.id}
                  className={`parameter-item${
                    expandedIds.includes(param.id) ? " expanded" : ""
                  }`}
                >
                  <header
                    className="parameter-header"
                    onClick={() => handleToggleExpand(param.id)}
                  >
                    <div className="parameter-title">
                      <p>
                        {param.id}. {param.question}
                      </p>
                      {/* {activeTab === "secondary" && !showIndustryWeightage && ( */}
                        <span
                          className="edit-icon"
                          onClick={(event) => {
                            console.log("cliekc");
                            event.stopPropagation();
                            handleEditParameter(param.id);
                          }}
                        >
                          <EditIcon />
                        </span>
                      {/* )} */}
                    </div>
                    <div className="parameter-action">
                      {showIndustryWeightage && (
                        <div className="parameter-weightage">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            onClick={(e) => e.stopPropagation()}
                            className={
                              errors.parameters?.[index]?.weightage
                                ? "border-danger"
                                : ""
                            }
                            {...register(`parameters.${index}.weightage`, {
                              required: "Weightage is required",
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: "Weightage must be at least 0",
                              },
                              max: {
                                value: 100,
                                message: "Weightage must not exceed 100",
                              },
                            })}
                          />
                        </div>
                      )}
                      <span
                        className={`expand-icon ${
                          expandedIds.includes(param.id) ? "expanded" : ""
                        }`}
                      >
                        <PlusIcon />
                      </span>
                    </div>
                  </header>
                  {expandedIds.includes(param.id) && (
                    <section className="parameter-details">
                      {!param?.options?.length ? (
                        <div className="empty-state">No options found.</div>
                      ) : (
                        param?.options?.map((option: any, index: number) => (
                          <p key={option.id} className="parameter-option">
                            {String.fromCharCode(65 + index)}.{" "}
                            {option.option_text}
                          </p>
                        ))
                      )}
                    </section>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        {showIndustryWeightage && parameterList?.data?.length ? (
          <div className="bottom-action">
            <Button
              text={t.buttons.save}
              type="submit"
              disabled={!isFormChanged}
              onClick={handleSubmit(onSubmit, onError)}
            />
            <Button
              text={t.buttons.reverseToIndustryDefault}
              type="button"
              onClick={() => null}
            />
          </div>
        ) : null}
      </section>

      {/* Pagination Controls */}
      {parameterList?.totalCount > itemsPerPage && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              onClick={() => {
                setQueryParams((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }));
              }}
              disabled={queryParams.page === 1}
              className="pagination-button"
            >
              <BackArrow />
            </button>
            <span className="pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => {
                let index = i + 1;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setQueryParams((prev) => ({
                        ...prev,
                        page: index,
                      }));
                    }}
                    className={`pagination-page-number${
                      queryParams.page === index ? " active" : ""
                    }`}
                    disabled={queryParams.page === index}
                  >
                    {index}
                  </button>
                );
              })}
            </span>
            <button
              onClick={() => {
                setQueryParams((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }));
              }}
              disabled={!parameterList?.hasNextPage}
              className="pagination-button"
            >
              <BackArrow />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageParametersPage;

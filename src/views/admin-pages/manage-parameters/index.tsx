import React, { useState, useEffect } from "react";

import "./index.scss";
import Button from "@/views/components/button";
import {
  AddCircleIcon,
  DownloadIcon,
  PlusIcon,
  Justice
} from "@/views/components/icons";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getParameterList } from "@/apis/parameter";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import { EditIcon } from "@/views/components/icons";
import { useForm, type FieldError } from "react-hook-form";
import { toast } from "react-toastify";


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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() =>
    location.state?.showSecondary ? TABS[1].key : TABS[0].key
  );
  const [searchParams] = useSearchParams();
  const industryId = searchParams.get("industryId");
  const industryName = searchParams.get("industryName");
  const showIndustryWeightage = !!industryId;

  const [totalPages, setTotalPages] = useState<number>(0);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    isPrimary: activeTab === "primary",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      parameters: [{ weightage: 0 }],
    },
  });

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
    setActiveTab((prev) => {
      return prev === key ? prev : key;
    });
    console.log("key=", key);
  };

  const handleBackClick = () => {
    navigate(-1);
  }

  const handleAddParameter = () => {
    navigate("/manage-parameters/add-parameter");
  };

  const handleEditParameter = (paramId: number) => {
    navigate(`/manage-parameters/edit-parameter/${paramId}`)
  }

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id],
    );
  };

  const { data: parameterList } = useQuery({
    queryKey: ["parameterList", queryParams, selectedLang],
    queryFn: () => getParameterList({ ...queryParams, language: selectedLang }),
  });

  useEffect(() => {
    if (parameterList?.data.length) {
      const weightageData = parameterList.data.map((param: any) => ({
        id: param.id,
        weightage: param.weightage || 0,
      }));
      setValue("parameters", weightageData);

      setTotalPages(Math.ceil(parameterList.totalCount / parameterList.limit));
    }
  }, [parameterList]);

  // const getParameterNumber = (index: number) => {
  //   return ((queryParams.page - 1) * itemsPerPage) + (index + 1)
  // }

  const onSubmit = (data: any) => {
    console.log("Submitted weightages:", data.parameters);
  };

  const onError = (errors: any) => {
    const flatErrors = Object.values(errors.parameters || {});
    if (flatErrors.length > 0) {
      const firstError = (flatErrors[0] as { weightage?: FieldError })?.weightage?.message;
      if (firstError) {
        toast.error(firstError);
      }
    }
  };

  return (
    <div className="manage-parameters-page">
      {showIndustryWeightage && industryName ?
        <div className="industry-name-view">
          <p>{industryName}</p>
        </div>
        : null}


      {/* Two tabs - Primary, Secondary */}
      <div className="tabs">
        <section className="tab-list">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`tab-button ${tab.key} ${activeTab === tab.key ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        <div className="actions">
          {showIndustryWeightage
            ?
            <>
              <div className="weightage-view">
                <Justice />
                <p>1000</p>
              </div>
              <Button
                text={t.buttons.back}
                icon={<BackArrow />}
                onClick={handleBackClick}
              />
            </>
            : <>
              {activeTab === "secondary" && (
                <Button
                  text="Add Parameter"
                  icon={<AddCircleIcon />}
                  onClick={handleAddParameter}
                  className="add-parameter-button"
                />
              )}
              <button className="export-button">
                <DownloadIcon />
              </button>
            </>}
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
                  className={`parameter-item${expandedIds.includes(param.id) ? " expanded" : ""}`}
                >
                  <header
                    className="parameter-header"
                    onClick={() => handleToggleExpand(param.id)}
                  >
                    <div className="parameter-title">
                      <p>{param.id}. {param.question}</p>
                      {activeTab === "secondary" && !showIndustryWeightage && (
                        <span
                          className="edit-icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditParameter(param.id);

                          }}
                        >
                          <EditIcon />
                        </span>
                      )}
                    </div>
                    <div className="parameter-action">
                      {showIndustryWeightage && (
                        <div className="parameter-weightage" >
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            onClick={(e) => e.stopPropagation()}
                            className={errors.parameters?.[index]?.weightage ? "border-danger" : ""}
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
                        className={`expand-icon ${expandedIds.includes(param.id) ? "expanded" : ""}`}
                      >
                        <PlusIcon />
                      </span>
                    </div>
                  </header>
                  {expandedIds.includes(param.id) && (
                    <section className="parameter-details">
                      {!param?.options?.length ?
                        <div className="empty-state">No options found.</div>
                        : param?.options?.map((option: any, index: number) => (
                          <p key={option.id} className="parameter-option">
                            {String.fromCharCode(65 + index)}. {option.option_text}
                          </p>
                        ))}
                    </section>
                  )}
                </li>
              ))}
            </ul>

          </>
        )}
        {showIndustryWeightage && parameterList?.data?.length
          ? <div className="bottom-action">
            <Button
              text={t.buttons.save}
              type="submit"
              onClick={handleSubmit(onSubmit, onError)}
            />
            <Button
              text={t.buttons.reverseToIndustryDefault}
              type="button"
              onClick={() => null}
            />
          </div>
          : null}
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
                let index = i + 1
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setQueryParams((prev) => ({
                        ...prev,
                        page: index,
                      }));
                    }}
                    className={`pagination-page-number${queryParams.page === index ? " active" : ""}`}
                    disabled={queryParams.page === index}
                  >
                    {index}
                  </button>
                )
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

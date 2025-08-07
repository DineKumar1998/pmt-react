import React, { useState, useEffect, useRef } from "react";
import Button from "@/views/components/button";
import { PlusIcon, DownloadIcon } from "@/views/components/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getClientParameterList,
  exportParameterList,
  getClientSelectedParameters,
} from "@/apis/parameter";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import DownArrow from "@/views/components/icons/DownArrow";
import { EditIcon } from "@/views/components/icons";
import EyeIcon from "@/views/components/icons/Eye";
import { toast } from "react-toastify";

import "./ManageClientParameters.scss";
import { useBreadcrumbs } from "@/context/Breadcrumb";
import { breadcrumbMapping } from "@/utils/breadcrumbs";

const ClientParameters: React.FC = () => {
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
  const clientId = searchParams.get("clientId");
  const selectedTab = searchParams.get("tab");

  const { addBreadcrumb } = useBreadcrumbs();

  const { rmName = "", memberName = "" } = useParams();

  const [activeTab, setActiveTab] = useState(() => selectedTab || TABS[0].key);

  const showClientParameterView = !!clientId;

  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState([]);

  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
    isPrimary: boolean;
    status: boolean | null;
  }>({
    page: 1,
    limit: itemsPerPage,
    isPrimary: activeTab === "primary",
    status: null,
  });

  const [parameterSearchList, setParameterSearchList] = useState([
    { id: 1, name: t.text.viewAll, isSelected: true, value: null },
    { id: 2, name: t.text.completed, isSelected: false, value: true },
    { id: 3, name: t.text.notCompleted, isSelected: false, value: false },
  ]);

  const [openParameterSearchDropdown, setOpenParameterSearchDropdown] =
    useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenParameterSearchDropdown(false);
      }
    };

    if (openParameterSearchDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openParameterSearchDropdown]);

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1,
      isPrimary: activeTab === "primary",
    }));
    setExpandedIds([]); // Collapse all when switching tabs
  }, [activeTab]);

  useEffect(() => {
    setParameterSearchList([
      { id: 1, name: t.text.viewAll, isSelected: true, value: null },
      { id: 2, name: t.text.completed, isSelected: false, value: true },
      { id: 3, name: t.text.notCompleted, isSelected: false, value: false },
    ]);
  }, [selectedLang]);

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

  const handleEditParameter = (param: any) => {
    addBreadcrumb({
      label: breadcrumbMapping["parameters"] + "-" + param.id,
      path: `/relationship-managers/${encodeURIComponent(
        rmName
      )}/${encodeURIComponent(memberName)}/parameters/${
        param.id
      }?clientId=${clientId}`,
    });
    navigate(
      `/relationship-managers/${encodeURIComponent(
        rmName
      )}/${encodeURIComponent(memberName)}/parameters/${
        param.id
      }?clientId=${clientId}`,
      {
        state: {
          clientId: clientId,
          isPrimary: activeTab === "primary",
        },
      }
    );
  };

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const { data: parameterList } = useQuery({
    queryKey: ["parameterList", clientId, queryParams],
    queryFn: () =>
      getClientParameterList(clientId ?? "", {
        ...queryParams,
        language: selectedLang,
      }),
  });
  const { data: selectedData, isLoading: isSelectedLoading } = useQuery({
    queryKey: ["selectedParamsList", clientId],
    queryFn: () => getClientSelectedParameters(clientId!),
    enabled: !!clientId,
  });
  useEffect(() => {
    if (!isSelectedLoading && selectedData) {
      const ids = selectedData.map((i:any) => i.selected_option_id);
      console.log("Initializing form with selected options:", ids);
      setSelectedIds(ids);
    }
  }, [selectedData, isSelectedLoading]);

  useEffect(() => {
    if (parameterList?.data.length) {
      setTotalPages(Math.ceil(parameterList.totalCount / parameterList.limit));
    }
  }, [parameterList]);

  const handleExportParameter = () => {
    exportParameterMutate({
      isPrimary: queryParams.isPrimary,
      language: selectedLang,
    });
  };

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

  return (
    <div className="manage-parameters-page">
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

        <div className="actions">
          {showClientParameterView ? (
            <>
              <Button
                text={t.buttons.back}
                icon={<BackArrow />}
                onClick={handleBackClick}
              />
              <div className="parameter-dropdown-container" ref={dropdownRef}>
                <button
                  className="parameter-dropdown-button"
                  onClick={() =>
                    setOpenParameterSearchDropdown(!openParameterSearchDropdown)
                  }
                >
                  <p>
                    {parameterSearchList.find((option) => option.isSelected)
                      ?.name || ""}
                  </p>
                  <DownArrow width={20} height={20} />
                </button>
                {openParameterSearchDropdown && (
                  <div className="dropdown-view">
                    {parameterSearchList
                      .filter((option) => !option.isSelected)
                      .map((option, index) => (
                        <button
                          key={index}
                          className="parameter-dropdown-button option-button"
                          onClick={() => {
                            setParameterSearchList((prev) =>
                              prev.map((opt) => ({
                                ...opt,
                                isSelected: opt.id === option.id,
                              }))
                            );
                            setQueryParams((prev) => ({
                              ...prev,
                              page: 1,
                              status: option.value,
                            }));
                            setOpenParameterSearchDropdown(false);
                          }}
                        >
                          <p>{option.name}</p>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <button onClick={handleExportParameter} className="export-button">
                <DownloadIcon />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Collapsable List of Parameters */}
      <section className="parameters-list">
        {parameterList?.data?.length === 0 ? (
          <div className="empty-state">No parameters found.</div>
        ) : (
          <>
            <ul>
              {parameterList?.data?.map((param: any) => (
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
                      {activeTab === "secondary" ? (
                        <span
                          className="edit-icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditParameter(param);
                          }}
                        >
                          <EditIcon />
                        </span>
                      ) : (
                        <span
                          className="eye-icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditParameter(param);
                          }}
                        >
                          <EyeIcon />
                        </span>
                      )}
                    </div>
                    <div className="parameter-action">
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
                        param?.options?.map((option: any) => (
                          <div key={option.id} className={`parameter-option`}>
                            <div className="checkbox-container">
                              {selectedIds.includes(option.id) ? (
                                <div className="checkbox-filled" />
                              ) : null}
                            </div>

                            <p>{option.option_text}</p>
                          </div>
                        ))
                      )}
                    </section>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
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

export default ClientParameters;

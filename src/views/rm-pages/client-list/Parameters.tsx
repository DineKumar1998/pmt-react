import React, { useState, useEffect } from "react";

import "./parameter.scss";
import Button from "@/views/components/button";
import {
  PlusIcon,
} from "@/views/components/icons";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClientParameterList } from "@/apis/rm-portal/client";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import DownArrow from "@/views/components/icons/DownArrow";
import { EditIcon } from "@/views/components/icons";
import EyeIcon from "@/views/components/icons/Eye";


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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() =>
    location.state?.showSecondary ? TABS[1].key : TABS[0].key
  );
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const clientName = searchParams.get("clientName");

  const showClientParameterView = !!clientId;


  const [totalPages, setTotalPages] = useState<number>(0);

  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
    isPrimary: boolean;
    status: boolean | null;
  }>({
    page: 1,
    limit: itemsPerPage,
    isPrimary: activeTab === "primary",
    status: null
  });

  const [parameterSearchList, setParameterSearchList] = useState([
    { id: 1, name: t.text.viewAll, isSelected: true, value: null },
    { id: 2, name: t.text.completed, isSelected: false, value: true },
    { id: 3, name: t.text.notCompleted, isSelected: false, value: false },
  ]);

  const [openParameterSearchDropdown, setOpenParameterSearchDropdown] = useState(false);


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
    ])
  }, [selectedLang])

  const navigate = useNavigate();

  const handleTabClick = (key: string) => {
    setActiveTab((prev) => {
      return prev === key ? prev : key;
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditParameter = (param: any) => {
    navigate(`/client-list/edit-parameter/${param.id}`, {
      state: {
        clientId: clientId,
        clientName: clientName,
        isPrimary: activeTab === "primary",
      }
    })
  }

  const handleToggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };


  const { data: parameterList } = useQuery({
    queryKey: ["parameterList", clientId, queryParams],
    queryFn: () => getClientParameterList(clientId ?? "", { ...queryParams, language: selectedLang }),
  });

  useEffect(() => {
    if (parameterList?.data.length) {
      setTotalPages(Math.ceil(parameterList.totalCount / parameterList.limit));
    }
  }, [parameterList]);


  return (
    <div className="manage-parameters-page">


      {/* Two tabs - Primary, Secondary */}
      <div className="tabs">
        <section className="tab-list">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`tab-button ${tab.key} ${activeTab === tab.key ? "active" : ""
                }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        <div className="actions">
          {showClientParameterView
            ?
            <>
              <Button
                text={t.buttons.back}
                icon={<BackArrow />}
                onClick={handleBackClick}
              />
              <div className="parameter-dropdown-container">
                <button
                  className="parameter-dropdown-button"
                  onClick={() => setOpenParameterSearchDropdown(!openParameterSearchDropdown)}
                >
                  <p>{parameterSearchList.find(option => option.isSelected)?.name || ''}</p>
                  <DownArrow width={20} height={20} />
                </button>
                {
                  openParameterSearchDropdown && (
                    <div className="dropdown-view">
                      {
                        parameterSearchList
                          .filter(option => !option.isSelected)
                          .map(((option, index) => (
                            <button
                              key={index}
                              className="parameter-dropdown-button option-button"
                              onClick={() => {
                                setParameterSearchList(prev =>
                                  prev.map(opt => ({
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
                          )))
                      }
                    </div>
                  )
                }
              </div>
            </>
            : null}
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
                  className={`parameter-item${expandedIds.includes(param.id) ? " expanded" : ""
                    }`}
                >
                  <header
                    className="parameter-header"
                    onClick={() => handleToggleExpand(param.id)}
                  >
                    <div className="parameter-title">
                      <p>{param.id}. {param.question}</p>
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
                        className={`expand-icon ${expandedIds.includes(param.id) ? "expanded" : ""
                          }`}
                      >
                        <PlusIcon />
                      </span>
                    </div>
                  </header>
                  {expandedIds.includes(param.id) && (
                    <section className="parameter-details">
                      {!param?.options?.length ?
                        <div className="empty-state">No options found.</div>
                        : param?.options?.map((option: any) => (
                          <div
                            key={option.id}
                            className={`parameter-option`}
                          >

                            <div className="checkbox-container">
                              {option.is_selected
                                ? <div className="checkbox-filled" />
                                : null}
                            </div>


                            <p>{option.option_text}</p>
                          </div>
                        ))}
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
                    className={`pagination-page-number${queryParams.page === index ? " active" : ""
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

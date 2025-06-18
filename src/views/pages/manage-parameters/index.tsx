import React, { useState, useEffect } from "react";

import "./index.scss";
import Button from "@/views/components/button";
import {
  AddCircleIcon,
  DownloadIcon,
  PlusIcon,
} from "@/views/components/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getParameterList } from "@/apis/parameter";
import { useLang } from "@/context/LangContext";
// import { translations } from "@/utils/translations";
import BackArrow from "@/views/components/icons/BackArrow";
import { EditIcon } from "@/views/components/icons";

const TABS = [
  {
    key: "primary",
    label: "Primary",
  },
  {
    key: "secondary",
    label: "Secondary",
  },
];

// Dummy data for parameters
const ManageParametersPage: React.FC = () => {
  const { selectedLang } = useLang();
  // const t = translations[selectedLang];
  const itemsPerPage = 10;
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() =>
    location.state?.showSecondary ? TABS[1].key : TABS[0].key
  );
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: itemsPerPage,
    isPrimary: activeTab === "primary",
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

  const getParameterNumber = (index: number) => {
    return ((queryParams.page - 1) * itemsPerPage) + (index + 1)
  }

  return (
    <div className="manage-parameters-page">
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
        </div>
      </div>

      {/* Collapsable List of Parameters */}
      <section className="parameters-list">
        {parameterList?.parameters?.length === 0 ? (
          <div className="empty-state">No parameters found.</div>
        ) : (
          <>
            <ul>
              {parameterList?.parameters?.map((param: any, index: number) => (
                <li
                  key={param.id}
                  className={`parameter-item${expandedIds.includes(param.id) ? " expanded" : ""}`}
                >
                  <header
                    className="parameter-header"
                    onClick={() => handleToggleExpand(param.id)}
                  >
                    <div className="parameter-title">
                      <p>{getParameterNumber(index)}. {param.question}</p>
                      {activeTab === "secondary" && (
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
                    <span
                      className={`expand-icon ${expandedIds.includes(param.id) ? "expanded" : ""}`}
                    >
                      <PlusIcon />
                    </span>
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

      </section>

      {/* Pagination Controls */}
      {parameterList?.total_rms > itemsPerPage && (
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
              {Array.from({ length: parameterList?.total_pages }, (_, i) => {
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
              disabled={queryParams.page === parameterList?.total_pages}
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

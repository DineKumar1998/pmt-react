import SearchComponent from "@/views/components/Search";
import React, { useState } from "react";
import { EditIcon, RedirectIcon } from "@/views/components/icons";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getIndustryList } from "@/apis/industry";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";

import "./index.scss";
import { useBreadcrumbs } from "@/context/Breadcrumb";

const ManageWeightagePage: React.FC = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const [queryParams, setQueryParams] = useState({
    search: "",
  });
  const { addBreadcrumb } = useBreadcrumbs();

  const { data: industryList } = useQuery({
    queryKey: ["industryList", queryParams, selectedLang],
    queryFn: () => getIndustryList({ ...queryParams, language: selectedLang }),
  });

  return (
    <div className="manage-weightage-page">
      <div className="buttons">
        <h1>{t.heading.industries}</h1>

        <SearchComponent
          placeholder={`${t.text.searchIndustries}...`}
          onSearch={(value) => {
            setQueryParams((prev) => ({
              ...prev,
              search: value ?? "",
            }));
          }}
        />
      </div>

      <section className="industries-list">
        {industryList?.length ? (
          industryList.map((industry: any) => (
            <div key={industry.id} className="industry-item">
              <div className="industry-name">
                <div className="main-container">
                  <h2>{industry.name}</h2>
                  <div className="percentages">
                    <span className="prim">
                      Prim: {industry.primaryPercentage}%
                    </span>
                    <span className="sec">
                      Sec: {industry.secondaryPercentage}%
                    </span>
                  </div>
                </div>
                <div className="action-container">
                  <NavLink
                    style={{ textDecoration: "none" }}
                    to={`/manage-weightage/${encodeURIComponent(
                      industry.name
                    )}?industryId=${industry.id}`}
                    className="redirect-icon"
                    onClick={() => {
                      addBreadcrumb({
                        label: industry.name,
                        path: `/manage-weightage/${encodeURIComponent(
                          industry.name
                        )}?industryId=${industry.id}`,
                      });
                    }}
                  >
                    <RedirectIcon />
                  </NavLink>
                  {industry.totalWeightage !== 1000 ? (
                    <NavLink
                      to={`/manage-weightage/${encodeURIComponent(
                        industry.name
                      )}?industryId=${industry.id}`}
                      onClick={() => {
                        addBreadcrumb({
                          label: industry.name,
                          path: `/manage-weightage/${encodeURIComponent(
                            industry.name
                          )}?industryId=${industry.id}`,
                        });
                      }}
                      className="edit-icon"
                    >
                      <EditIcon fill={"#e46363"} width={18} height={18} />
                    </NavLink>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No industries found.</div>
        )}
      </section>
    </div>
  );
};

export default ManageWeightagePage;

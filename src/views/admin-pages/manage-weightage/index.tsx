import SearchComponent from "@/views/components/Search";
import React, { useState } from "react";
import { EditIcon, RedirectIcon } from "@/views/components/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { getIndustryList } from "@/apis/industry";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import "./index.scss";


const ManageWeightagePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const [queryParams, setQueryParams] = useState({
    search: "",
  });

  const openIndustryParametersPage = (industryId: number, industryName: string) => {
    navigate(`/manage-weightage/industry?industryId=${industryId}&industryName=${industryName}`)
  }


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
        {industryList?.length
          ? industryList.map((industry: any) => (
            <div key={industry.id} className="industry-item">
              <div className="industry-name">
                <div className="main-container">
                  <h2>{industry.name}</h2>
                  <div className="percentages">
                    <span className="prim">Prim: {industry.primaryPercentage}%</span>
                    <span className="sec">Sec: {industry.secondaryPercentage}%</span>
                  </div>
                </div>
                <div className="action-container">
                  <span className="redirect-icon" onClick={() => openIndustryParametersPage(industry.id, industry.name)}>
                    <RedirectIcon />
                  </span>
                  {industry.totalWeightage !== 1000 ?
                    <span className="edit-icon" onClick={() => openIndustryParametersPage(industry.id, industry.name)}>
                      <EditIcon fill={"#e46363"} width={18} height={18} />
                    </span>
                    : null}
                </div>
              </div>
            </div>
          ))
          : <div className="empty-state">No industries found.</div>
        }
      </section>
    </div>
  );
};

export default ManageWeightagePage;

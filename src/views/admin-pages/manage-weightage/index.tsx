import SearchComponent from "@/views/components/Search";
import React from "react";

import "./index.scss";
import { RedirectIcon } from "@/views/components/icons";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { getIndustryList } from "@/apis/industry";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";


const ManageWeightagePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLang } = useLang();
  const t = translations[selectedLang];

  const openIndustryParametersPage = (industryId: number, industryName: string) => {
    navigate(`/manage-weightage/industry?industryId=${industryId}&industryName=${industryName}`)
  }


  const { data: industryList } = useQuery({
    queryKey: ["industryList", selectedLang],
    queryFn: () => getIndustryList(selectedLang),
  });

  return (
    <div className="manage-weightage-page">
      <div className="buttons">
        <h1>{t.heading.industries}</h1>

        <SearchComponent placeholder={`${t.text.searchIndustries}...`} />
      </div>

      <section className="industries-list">
        {industryList?.length
          ? industryList.map((industry: any) => (
            <div key={industry.id} className="industry-item">
              <div className="industry-name">
                <h2>{industry.name}</h2>
                <span className="redirect-icon" onClick={() => openIndustryParametersPage(industry.id, industry.name)}>
                  <RedirectIcon />
                </span>
              </div>
              <div className="percentages">
                <span className="prim">Prim: {industry.primaryPercentage}%</span>
                <span className="sec">Sec: {industry.secondaryPercentage}%</span>
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

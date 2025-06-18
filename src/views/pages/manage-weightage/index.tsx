import SearchComponent from "@/views/components/Search";
import React from "react";

import "./index.scss";
import { RedirectIcon } from "@/views/components/icons";

const Industries = [
  {
    name: "Technology",
    p_percentage: 30,
    s_percentage: 20,
  },
  {
    name: "Healthcare",
    p_percentage: 25,
    s_percentage: 15,
  },
  {
    name: "Finance",
    p_percentage: 20,
    s_percentage: 10,
  },
  {
    name: "Retail",
    p_percentage: 15,
    s_percentage: 5,
  },
  {
    name: "Manufacturing",
    p_percentage: 10,
    s_percentage: 5,
  },

  {
    name: "Technology",
    p_percentage: 30,
    s_percentage: 20,
  },
  {
    name: "Healthcare",
    p_percentage: 25,
    s_percentage: 15,
  },
  {
    name: "Finance",
    p_percentage: 20,
    s_percentage: 10,
  },
  {
    name: "Retail",
    p_percentage: 15,
    s_percentage: 5,
  },
  {
    name: "Manufacturing",
    p_percentage: 10,
    s_percentage: 5,
  },
  {
    name: "Technology",
    p_percentage: 30,
    s_percentage: 20,
  },
  {
    name: "Healthcare",
    p_percentage: 25,
    s_percentage: 15,
  },
  {
    name: "Finance",
    p_percentage: 20,
    s_percentage: 10,
  },
  {
    name: "Retail",
    p_percentage: 15,
    s_percentage: 5,
  },
  {
    name: "Manufacturing",
    p_percentage: 10,
    s_percentage: 5,
  },
  {
    name: "Technology",
    p_percentage: 30,
    s_percentage: 20,
  },
  {
    name: "Healthcare",
    p_percentage: 25,
    s_percentage: 15,
  },
  {
    name: "Finance",
    p_percentage: 20,
    s_percentage: 10,
  },
  {
    name: "Retail",
    p_percentage: 15,
    s_percentage: 5,
  },
  {
    name: "Manufacturing",
    p_percentage: 10,
    s_percentage: 5,
  },
  {
    name: "Technology",
    p_percentage: 30,
    s_percentage: 20,
  },
  {
    name: "Healthcare",
    p_percentage: 25,
    s_percentage: 15,
  },
  {
    name: "Finance",
    p_percentage: 20,
    s_percentage: 10,
  },
  {
    name: "Retail",
    p_percentage: 15,
    s_percentage: 5,
  },
  {
    name: "Manufacturing",
    p_percentage: 10,
    s_percentage: 5,
  },
];

const ManageWeightagePage: React.FC = () => {
  return (
    <div className="manage-weightage-page">
      <div className="buttons">
        <h1>Industries</h1>

        <SearchComponent placeholder="Search Industries..." />
      </div>

      <section className="industries-list">
        {Industries.map((industry, index) => (
          <div key={index} className="industry-item">
            <div className="industry-name">
              <h2>{industry.name}</h2>
              <span className="redirect-icon">
                <RedirectIcon />
              </span>
            </div>
            <div className="percentages">
              <span className="prim">Prim: {industry.p_percentage}%</span>
              <span className="sec">Sec: {industry.s_percentage}%</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ManageWeightagePage;

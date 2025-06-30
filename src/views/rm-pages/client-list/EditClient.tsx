import React from "react";

// ** SCSS
import "./index.scss";
import Button from "@/views/components/button";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { useLang } from "@/context/LangContext";
import { getClientById } from "@/apis/client";
import { translations } from "@/utils/translations";

const EditClient = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const { clientId } = useParams();
  let navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    companyName: "Sony Corporation",
    industry: "Electronics",
    email: "Sony Corporation",
    address: "Tokyo, Japan",
    contactDetails: "+91 9888252547",
    assignDate: "25 Feb, 2025",
    lastUpdated: "25 Mar, 2025",
    status: "P-100% / S-60%",
    currentRM: "Satoru GojoYuji",
    updatedRM: "",
  });

  const rmOptions = ["Satoru GojoYuji", "John Doe", "Jane Smith"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    alert("Save clicked!");
  };

  const backHandler = () => {
    navigate(-1);
  };

  const { data: clientData } = useQuery({
    queryKey: ['clientData', clientId, selectedLang],
    queryFn: () =>
      getClientById(clientId || "", selectedLang),
  });

  console.log("clientData=", clientData)

  return (
    <div className="edit-client">
      <h2 className="mb-1">{t.heading.editParameter}</h2>
      <div className="details">
        <label className="label">Company Name</label>
        <span className="text-value">{formData.companyName}</span>

        <label className="label">Industry</label>
        <span className="text-value">{formData.industry}</span>

        <label className="label">Email</label>
        <span className="text-value">{formData.email}</span>

        <label className="label">Address</label>
        <span className="text-value">{formData.address}</span>

        <label className="label">Contact Details</label>
        <span className="text-value">{formData.contactDetails}</span>

        <label className="label">Assign Date</label>
        <span className="text-value">{formData.assignDate}</span>

        <label className="label">Last Updated</label>
        <span className="text-value">{formData.lastUpdated}</span>

        <label className="label">Status</label>
        <span className="text-value">{formData.status}</span>

        <label className="label">Current RM</label>
        <span className="text-value">{formData.currentRM}</span>

        <label className="label mt-1">Updated RM</label>
        <select
          name="updatedRM"
          value={formData.updatedRM}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Updated RM</option>
          {rmOptions.map((rm) => (
            <option key={rm} value={rm}>
              {rm}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 d-flex gap-1">
        <Button onClick={backHandler} text="Back" className="back-btn" />

        <Button onClick={handleSave} text="Save" />
      </div>
    </div>
  );
};

export default EditClient;

import React from "react";

// ** SCSS
import Button from "@/views/components/button";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import "./index.scss";
// import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";

const EditClient = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
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

        {/* <Combobox value={formData.updatedRM} onChange={handleChange} as="div" className="combobox-container">
          <ComboboxInput
            className="input-field"
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            displayValue={(rm: RmData) => rm ? `${rm.first_name} ${rm.last_name ?? ''}`.trim() : ''}
            placeholder={t.text.selectRm}
          />
          <ComboboxOptions className="combobox-options">

            {rmOptions.length === 0 && query !== '' ? (
              // If true, render a non-selectable message
              <div className="combobox-no-results">
                No results found.
              </div>
            ) : (
              // Otherwise, render the list of options as before
              rmOptions.map((rm: RmData) => (
                <Combobox.Option key={rm.id} value={rm} className="combobox-option">
                  {`${rm.first_name} ${rm.last_name ?? ''}`.trim()}
                </Combobox.Option>
              ))
            )}

          </ComboboxOptions>
        </Combobox> */}
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

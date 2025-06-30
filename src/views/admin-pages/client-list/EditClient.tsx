import React from "react";

// ** SCSS
import "./index.scss";
import Button from "@/views/components/button";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from '@tanstack/react-query'
import { useLang } from "@/context/LangContext";
import { getClientById, assignRmToClient } from "@/apis/client";
import { getRMNames } from "@/apis/rm";
import { translations } from "@/utils/translations";
import { toast } from 'react-toastify'

const EditClient = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];
  const { clientId } = useParams();
  let navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    updatedRM: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const formattedData = {
      rmId: parseInt(formData.updatedRM)
    };
    assignRmMutate(formattedData)
  };

  const backHandler = () => {
    navigate(-1);
  };

  const { data: clientData } = useQuery({
    queryKey: ['clientData', clientId, selectedLang],
    queryFn: () =>
      getClientById(clientId || "", selectedLang),
  });

  const { data: rmList } = useQuery({
    queryKey: ['rmList', selectedLang],
    queryFn: () =>
      getRMNames(selectedLang),
  });

  const { mutate: assignRmMutate } = useMutation({
    mutationFn: (body: any) => assignRmToClient(clientId || "", body),
    onSuccess: (data) => {
      console.log("assignRmToClient success data=", data)
      toast.success(data?.message)
    },
    onError: (error: any) => {
      console.log("error===", error)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong."
      console.error("assignRmToClient error =", message)
      toast.error(message)
    },
  })


  const getFormattedDate = (date: string): string => {
    return date
      ? new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : ""
  }

  const getStats = (statsData: any): string => {
    const [first] = statsData ?? [];
    const primary = first?.primaryPercentage ?? 0;
    const secondary = first?.secondaryPercentage ?? 0;
    return `P-${primary}% / S-${secondary}%`;
  };

  return (
    <div className="edit-client">
      <h2 className="mb-1">{t.heading.editParameter}</h2>
      <div className="details">
        <label className="label">{t.formLabel.companyName}</label>
        <span className="text-value">{clientData?.client_name}</span>

        <label className="label">{t.heading.industry}</label>
        <span className="text-value">{clientData?.industry_name}</span>

        <label className="label">{t.formLabel.email}</label>
        <span className="text-value">{clientData?.email}</span>

        <label className="label">{t.table.address}</label>
        <span className="text-value">{clientData?.address}</span>

        <label className="label">{t.formLabel.contactDetails}</label>
        <span className="text-value">{clientData?.phone}</span>

        <label className="label">{t.formLabel.assignedDate}</label>
        <span className="text-value">{getFormattedDate(clientData?.assigned_date)}</span>

        <label className="label">{t.formLabel.lastUpdated}</label>
        <span className="text-value">{getFormattedDate(clientData?.updatedAt)}</span>

        <label className="label">{t.formLabel.status}</label>
        <span className="text-value">{getStats(clientData?.stats)}</span>

        <label className="label">{t.formLabel.currentRM}</label>
        <span className="text-value">
          {`${clientData?.rm_first_name} ${(clientData?.rm_last_name ?? '').trim()}`.trim()}
        </span>

        <label className="label mt-1">{t.formLabel.updatedRM}</label>
        <select
          name="updatedRM"
          value={formData.updatedRM}
          onChange={handleChange}
          className="input-field"
        >
          <option value="" disabled hidden>{t.text.selectRm}</option>
          {rmList?.map((rm: any) => (
            <option key={rm.id} value={rm.id}>
              {`${rm.first_name} ${(rm.last_name ?? '').trim()}`.trim()}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 d-flex gap-1">
        <Button onClick={backHandler} text={t.buttons.back} className="back-btn" />

        <Button
          onClick={handleSave}
          text={t.buttons.save}
          disabled={!formData.updatedRM}
        />
      </div>
    </div>
  );
};

export default EditClient;

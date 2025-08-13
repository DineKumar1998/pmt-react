import React, { useState, useEffect } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import Button from "@/views/components/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from '@tanstack/react-query'
import { useLang } from "@/context/LangContext";
import { getClientById, assignRmToClient } from "@/apis/client";
import { getRMNames } from "@/apis/rm";
import { translations } from "@/utils/translations";
import { toast } from 'react-toastify'
import { ProgressBar } from ".";
import { BackButton } from "@/views/components/BackButton";

import "./index.scss";

type RmData = {
  id: number;
  first_name: string;
  last_name: string;
}

const EditClient = () => {
  const { selectedLang } = useLang();
  const navigate = useNavigate();
  const t = translations[selectedLang];

  const [searchParams] = useSearchParams();

  const memberId = searchParams.get('memberId') || '';

  const [selectedRm, setSelectedRm] = useState(null);
  const [query, setQuery] = useState('');

  const { data: clientData, } = useQuery({
    queryKey: ['clientData', memberId, selectedLang],
    queryFn: () => getClientById(memberId || "", selectedLang),
  });

  const { data: rmList, isFetching } = useQuery({
    queryKey: ['rmList', selectedLang],
    queryFn: () => getRMNames(selectedLang),
  });

  useEffect(() => {
    if (clientData && rmList) {
      const currentRm = rmList.find((rm: RmData) => rm.id === clientData.rm_id);
      if (currentRm) {
        setSelectedRm(currentRm);
      }
    }
  }, [clientData, rmList]);

  const { mutate: assignRmMutate, isPending } = useMutation({
    mutationFn: (body: any) => assignRmToClient(memberId || "", body),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Something went wrong.";
      console.error("assignRmToClient error =", message);
      toast.error(message);
    },
  });

  // 3. Update submission logic to use the selectedRm state object
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (!selectedRm) {
      toast.error("Please select a Relationship Manager.");
      return;
    }
    const formattedData = {
      rmId: selectedRm['id']
    };
    assignRmMutate(formattedData);

    navigate('/member-list', { replace: true });
  };

  // 4. Filter the RM list based on the user's input query
  const filteredRmList =
    query === ''
      ? rmList
      : rmList?.filter((rm: any) => {
        const fullName = `${rm.first_name} ${rm.last_name ?? ''}`.trim().toLowerCase();
        return fullName.includes(query.toLowerCase());
      }) || [];


  const getFormattedDate = (date: string): string => {
    return date
      ? new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : ""
  }

  const getStats = (statsData: any) => {
    const [first] = statsData ?? [];
    const primary = first?.primaryPercentage ?? 0;
    const secondary = first?.secondaryPercentage ?? 0;

    return <div className="progress-bar-wrapper">
      <div className="progress-bar-container">
        <span>P</span>
        <ProgressBar value={primary} isPrimary={true} />
        <span>{primary}%</span>
      </div>
      <div className="progress-bar-container">
        <span>S</span>
        <ProgressBar value={secondary} />
        <span>{secondary}%</span>
      </div>
    </div>
  };

  if (isFetching) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="d-flex">
        <BackButton />  <h4> CLIENT ID: #{memberId}</h4>
      </div>
      <div className="edit-client-page mt-1">
        <dl className="details-list">
          {/* ... all your <dt> and <dd> elements remain the same ... */}
          <dt>{t.formLabel.companyName}</dt>
          <dd>{clientData?.client_name}</dd>

          <dt>{t.heading.industry}</dt>
          <dd>{clientData?.industry_name}</dd>

          <dt>{t.formLabel.status}</dt>
          <dd>{getStats(clientData?.stats)}</dd>

          <dt>{t.table.address}</dt>
          <dd>{clientData?.address}</dd>

          <dt>{t.formLabel.projectCount}</dt>
          <dd>{clientData?.project_count}</dd>

          <dt>{t.formLabel.email}</dt>
          <dd>{clientData?.email}</dd>


          <dt>{t.formLabel.contactDetails}</dt>
          <dd>{clientData?.phone}</dd>

          <dt>{t.formLabel.assignedDate}</dt>
          <dd>{getFormattedDate(clientData?.assigned_date)}</dd>
          <dt>{t.formLabel.lastUpdated}</dt>
          <dd>{getFormattedDate(clientData?.updatedAt)}</dd>

          <dt>{t.formLabel.currentRM}</dt>
          <dd>
            {`${clientData?.rm_first_name} ${(clientData?.rm_last_name ?? '').trim()}`.trim()}
          </dd>
        </dl>

        <form onSubmit={handleSave} className="edit-client-form">
          <div className="form-field-group mt-1">
            <label className="label">{t.formLabel.updatedRM}</label>

            <Combobox value={selectedRm} onChange={(data) => {
              setSelectedRm(data)
            }} as="div" className="combobox-container">
              <ComboboxButton className="combobox-button">
                <ComboboxInput
                  className="input-field"
                  onChange={(event) => {
                    setQuery(event.target.value)
                  }}
                  displayValue={(rm: RmData) => rm ? `${rm.first_name} ${rm.last_name ?? ''}`.trim() : ''}
                  placeholder={t.text.selectRm}
                />
              </ComboboxButton>

              <ComboboxOptions className="combobox-options">

                {filteredRmList.length === 0 && query !== '' ? (
                  // If true, render a non-selectable message
                  <div className="combobox-no-results">
                    No results found.
                  </div>
                ) : (
                  // Otherwise, render the list of options as before
                  filteredRmList.map((rm: RmData) => (
                    <ComboboxOption key={rm.id} value={rm} className="combobox-option">
                      {`${rm.first_name} ${rm.last_name ?? ''}`.trim()}
                    </ComboboxOption>
                  ))
                )}

              </ComboboxOptions>
            </Combobox>
          </div>

          <div className="form-actions mt-2">
            <Button
              type="submit"
              onClick={() => null}
              text={t.buttons.save}
              disabled={!selectedRm || isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClient;
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { translations } from '@/utils/translations';
import { createParameter } from '@/apis/parameter';

import { ParameterForm, type FormValues } from './ParameterForm'; // Import the reusable form
import { BackButton } from '@/views/components/BackButton';
import Button from '@/views/components/button';

import { useNavigate } from 'react-router-dom';

import "../index.scss";


const AddParameter = () => {
  const [language, setLanguage] = useState<'en' | 'jp'>('en');
  const t = translations[language];

  const navigate = useNavigate();

  // State to disable the form after successful creation
  const [disableParamEditing, setDisableParamEditing] = useState(false);

  const { mutate: createParameterMutate, isPending } = useMutation({
    mutationFn: (body: any) => createParameter(body),
    onSuccess: (data) => {
      toast.success(data?.message);
      setDisableParamEditing(true);
      if (data?.paramId) {
        return navigate(`/manage-parameters/${data.paramId}`);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Something went wrong.";
      toast.error(message);
    },
  });

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      question: data.parameter,
      options: data.options,
      language,
    };
    createParameterMutate(formattedData);
  };

  const actions = (
    <div className="parent-actions">
      <div className="actions-right">
        <Button
          text={t.buttons.save}
          type="submit"
          onClick={() => null}
          disabled={disableParamEditing || isPending}
        />
      </div>
    </div>
  );

  return (
    <div className="add-parameter-form">
      <div className="parent-section">
        <section className="left-section">
          <div className="d-flex">
            <BackButton title=" " />
            <h2>{t.heading.addParameter}</h2>
          </div>
          <div className="language-buttons">
            <Button text="English" onClick={() => setLanguage("en")} className={language === "en" ? "" : "back-btn"} />
            <Button text="日本語" onClick={() => setLanguage("jp")} className={language === "jp" ? "" : "back-btn"} />
          </div>
          <ParameterForm
            onSubmit={onSubmit}
            isEditMode={false}
            disableParamEditing={disableParamEditing}
            language={language}
            actions={actions}
          />
        </section>
      </div>
    </div>
  );
};

export default AddParameter;

import React, { useEffect, useState } from "react";
import Button from "@/views/components/button";

import { useNavigate, useParams } from "react-router-dom";
import { createRMValidator, editRMValidator } from "@/validations/rmValidator";
import { toast } from 'react-toastify'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createRM, getRMById, editRM } from '@/apis/rm';
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";
import "./index.scss";

const AddUserForm = () => {
  const { selectedLang } = useLang();
  const t = translations[selectedLang];

  const { rmId } = useParams();
  const isEditMode = !!rmId;
  const navigate = useNavigate();

  const [editPasswordView, showEditPasswordView] = useState(false);

  const [formData, setFormData] = React.useState({
    rmId: "",
    first_name: "",
    last_name: "",
    email: "",
    country_code: "+91",
    phone: "",
    password: "",
    user_type: "RM"
  });

  type FormErrors = {
    first_name?: string;
    last_name?: string;
    email?: string;
    country_code?: string;
    phone?: string;
    password?: string;
    [key: string]: string | undefined;
  };

  const [errors, setErrors] = React.useState<FormErrors>({});


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("field name=", name)
    console.log("errors=", errors)
    setErrors({ ...errors, [name]: null }); // clear error on change
  };

  // const handleGeneratePassword = () => {
  //   //OTP will be sent to the RM's email for confirmation. 
  //   //Only after OTP validation, admin can set the password
  // };

  const handleResetPassword = () => {
    //OTP will be sent to the RM's email for confirmation. 
    //Only after OTP validation, admin can set the password
    showEditPasswordView(true)
  }

  const handleSave = () => {
    console.log("Save clicked=", formData);
    const parsed = createRMValidator.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.log("fieldErrors=", fieldErrors)
      setErrors(fieldErrors as any);
      return;
    }
    console.log("Validated data:", parsed.data);
    createRmMutate(parsed.data)
  };

  const handleEdit = () => {
    console.log("Edit clicked=", formData);
    const { password, ...editData } = formData;
    const parsed = editRMValidator.safeParse(password === "" ? editData : formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      console.log("fieldErrors=", fieldErrors)
      setErrors(fieldErrors as any);
      return;
    }
    console.log("Validated data:", parsed.data);
    editRmMutate(parsed.data)
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const { mutate: createRmMutate } = useMutation({
    mutationFn: (body: any) => createRM(body),
    onSuccess: (data) => {
      console.log("createRM success data=", data)
      toast.success(data?.message)
      navigate(-1);
    },
    onError: (error: any) => {
      console.log("error===", error)
      const message = error?.message;

      console.error("createRM error =", message)
      toast.error(message)
    },
  })

  const { mutate: editRmMutate } = useMutation({
    mutationFn: (body: any) => editRM(rmId || "", body),
    onSuccess: (data) => {
      console.log("editRM success data=", data)
      toast.success(data?.message)
      navigate(-1);
    },
    onError: (error: any) => {
      console.log("error===", error)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong."
      console.error("createRM error =", message)
      toast.error(message)
    },
  })

  const { data: rmData } = useQuery({
    queryKey: ['rmData', rmId, selectedLang],
    queryFn: () =>
      getRMById(rmId || "", selectedLang),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (rmData) {
      console.log("rmData loaded:", rmData);
      setFormData((prev) => ({
        ...prev,
        rmId: rmData.id,
        first_name: rmData.first_name || "",
        last_name: rmData.last_name || "",
        email: rmData.email || "",
        country_code: rmData.country_code || "+91",
        phone: rmData.phone || "",
      }));
    }
  }, [rmData]);

  return (
    <div className="add-rm-form">
      <h2>{isEditMode ? t.routes.editUser : t.routes.addUser}</h2>

      <form>
        {isEditMode ?
          <div>
            <label className="label">RM ID</label>
            <input
              type="text"
              name="rmId"
              value={formData.rmId}
              className="input-field"
              disabled
            />
          </div> : null}
        <div>
          <label className="label">{t.formLabel.firstName}*</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="input-field"
            placeholder={t.text.enterFirstName}
          />
          {errors.first_name && <p className="form-error">{errors.first_name}</p>}
        </div>
        <div>
          <label className="label">{t.formLabel.lastName}</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="input-field"
            placeholder={t.text.enterLastName}
          />
          {errors.last_name && <p className="form-error">{errors.last_name}</p>}
        </div>

        <div>
          <label className="label">{t.table.email}*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder={t.text.enterEmail}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="label">{t.formLabel.phoneNumber}</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className="country-select"
              style={{
                padding: "0.7rem 0.5rem",
                borderRadius: "5px 0 0 5px",
                fontSize: "inherit",
                backgroundColor: "#fafafa",
                border: "1px solid #f0f0f0",
              }}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+81">🇯🇵 +81</option>
            </select>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              style={{ borderRadius: "0 5px 5px 0" }}
              maxLength={10}
              placeholder={t.text.enterPhoneNumber}
            />
          </div>

          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        {!isEditMode || (isEditMode && editPasswordView) ?
          <div>
            <label className="label">{isEditMode ? `${t.formLabel.resetPassword}` : `${t.formLabel.password}*`}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder={t.text.enterPassword}
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div> : null}
      </form>

      <div className="actions">
        {/* <Button
          className="generate-password"
          onClick={handleGeneratePassword}
          text="Generate Password"
        /> */}
        {isEditMode && !editPasswordView ?
          <Button
            className="generate-password"
            onClick={handleResetPassword}
            text="Reset Password"
          /> : null}
        <div className="save-cancel-btn">
          <Button text={t.buttons.save} type="submit" onClick={isEditMode ? handleEdit : handleSave} />
          <Button className="back-btn" onClick={handleCancel} text={t.buttons.cancel} />
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;

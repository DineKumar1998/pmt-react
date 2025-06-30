import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./index.scss";
import Button from "@/views/components/button";
import { getRMById, editRM } from '@/apis/rm';
import { useMutation, useQuery } from '@tanstack/react-query'
import { useLang } from "@/context/LangContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { editRMValidator } from "@/validations/rmValidator";
import type { z } from "zod";
import { translations } from "@/utils/translations";
import { toast } from 'react-toastify'
import { ASSETS_FOLDERS, AUTH } from "@/utils/constants";

type FormValues = z.infer<typeof editRMValidator>;

const ProfilePage = () => {
    const { selectedLang } = useLang();
    const t = translations[selectedLang];
    const userId = localStorage.getItem(AUTH.USER_ID);
    const [isPasswordEditable, setIsPasswordEditable] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(editRMValidator),
        defaultValues: {
            first_name: "",
            last_name: "",
            country_code: "+91",
            phone: "",
            password: "",
            profile_img: undefined,
        },
    });

    const [profileImgPreview, setProfileImgPreview] = useState<string | null>(null);

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImgPreview(URL.createObjectURL(file));
            setValue("profile_img", file); // store FileList in form
        }
    };

    const { mutate: editRmMutate } = useMutation({
        mutationFn: (body: any) => editRM(userId || "", body),
        onSuccess: (data) => {
            console.log("editRM success data=", data)
            toast.success(data?.message)
        },
        onError: (error: any) => {
            console.log("error===", error)
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong."
            console.error("editRM error =", message)
            toast.error(message)
        },
    })

    const onSubmit = (data: FormValues) => {
        // console.log("data=", data)
        // const payload = { ...data };
        // if (payload.password === "") {
        //     delete payload.password;
        // }
        // console.log("payload=", payload)
        // editRmMutate(payload)
        let payload: any = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            // Handle password: only append if it's not an empty string
            if (key === "password") {
                if (value !== "") {
                    payload.append(key, value);
                }
                return; // Skip the rest of the conditions
            }

            // Skip undefined or null values
            if (value === undefined || value === null) return;

            // Append other fields normally
            payload.append(key, value);
        });
        const dataObject = Object.fromEntries(payload.entries());

        console.log("dataObject=", dataObject)
        editRmMutate(payload);
    };

    const { data: userData } = useQuery({
        queryKey: ['rmData', userId, selectedLang],
        queryFn: () =>
            getRMById(userId || "", selectedLang),
    });

    useEffect(() => {
        if (userData) {
            console.log("userData=", userData)
            reset({
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                country_code: userData.country_code || "+91",
                phone: userData.phone || "",
                password: "",
            });

            if (userData.profile_img) {
                setProfileImgPreview(`${ASSETS_FOLDERS.PROFILE}/${userData.profile_img}`);
            }
        }
    }, [userData, reset]);

    const handleChangePasswordClick = () => {
        setIsPasswordEditable(true);
    }

    return (
        <div className="profile-form">
            <p className="profile-heading">{t.heading.profileInfo}</p>
            <hr />

            <div className="parent-section">
                <div className="left-section">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="field-section">
                            <label>{t.formLabel.profileImage}</label>
                            <div className="input-section">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageChange}
                                    className="input-field"
                                />
                                {profileImgPreview && (
                                    <div className="image-preview-wrapper">
                                        <img
                                            src={profileImgPreview}
                                            alt="Profile Preview"
                                            className="image-preview"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="field-section">
                            <label>
                                {t.formLabel.firstName} <span className="required-star">*</span>
                            </label>
                            <div className="input-section">
                                <input
                                    type="text"
                                    {...register("first_name", { required: true })}
                                    className="input-field"
                                    placeholder="Enter first name"
                                />
                                {errors.first_name && <p className="form-error">{errors.first_name.message}</p>}
                            </div>
                        </div>

                        <div className="field-section">
                            <label>{t.formLabel.lastName}</label>
                            <div className="input-section">
                                <input
                                    type="text"
                                    {...register("last_name")}
                                    className="input-field"
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>

                        <div className="field-section">
                            <label>{t.formLabel.mobile}</label>
                            <div style={{ flex: 7 }}>
                                <div className="input-section" style={{ display: "flex", alignItems: "center" }}>
                                    <select
                                        {...register("country_code")}
                                        className="country-select"
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+81">🇯🇵 +81</option>
                                    </select>
                                    <input
                                        type="text"
                                        {...register("phone", { maxLength: 10 })}
                                        className="input-field"
                                        placeholder="Enter mobile number"
                                        style={{ borderRadius: "0 8px 8px 0" }}
                                        maxLength={10}
                                    />
                                </div>
                                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="field-section">
                            <label>{t.formLabel.password}</label>
                            <div className="input-section">
                                <div className="password-wrapper">
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="input-field"
                                        placeholder={isPasswordEditable ? "Enter new password" : "************"}
                                        readOnly={!isPasswordEditable}
                                    />
                                    {!isPasswordEditable && (
                                        <span className="change-password-text" onClick={handleChangePasswordClick}>
                                            Change Password
                                        </span>
                                    )}
                                </div>
                                {errors.password && <p className="form-error">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div className="actions">
                            <Button
                                text={t.buttons.saveChanges}
                                type="submit"
                                onClick={() => null}
                            />
                        </div>
                    </form>
                </div>

                <div className="right-section">
                    <div className="info-section">
                        <label>{t.formLabel.email}</label>
                        <p>{userData?.email || ""}</p>
                    </div>
                    <div className="info-section">
                        <label>{t.formLabel.id}</label>
                        <p>{userData?.id || ""}</p>
                    </div>
                    <div className="info-section">
                        <label>{t.formLabel.role}</label>
                        <p>{userData?.user_type || ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

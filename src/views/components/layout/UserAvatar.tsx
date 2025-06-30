import { useState, useRef, useEffect } from "react";

import Avatar from "@assets/Avatar.png";
import BackArrow from "../icons/BackArrow";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutIcon, UserCircleIcon, UserRoundedFillIcon } from "../icons";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../../apis/auth";
import { toast } from "react-toastify";
import { ASSETS_FOLDERS, AUTH } from "@/utils/constants";

const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);


  const navigate = useNavigate();

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { mutate: logoutMutate } = useMutation({
    mutationFn: (body: any) => logoutUser(body),
    onSuccess: (_data) => {
      localStorage.removeItem(AUTH.PROFILE_IMG);
      localStorage.removeItem(AUTH.TOKEN_KEY);
      localStorage.removeItem(AUTH.USER_ID);
      localStorage.removeItem(AUTH.USER_NAME);
      localStorage.removeItem(AUTH.USER_TYPE);
      setOpen(false);
      navigate("/login");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      console.error("Logout error =", message);
      toast.error(message);
    },
  });

  const renderrAvatar = () => {
    const profile = localStorage.getItem(AUTH.PROFILE_IMG);

    if (profile && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(profile)) {
      return <img src={ASSETS_FOLDERS.PROFILE + "/" + profile} alt="User Avatar" />
    }

    return <img src={Avatar} alt="User Avatar" />
  }

  return (
    <div className="avatar" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="profile-img">
        {renderrAvatar()}
        <span className="icon">
          <BackArrow />
        </span>
      </button>

      {open && (
        <div className="dropdown-menu ">
          <ul>
            <li>
              <p className="username">
                <span>
                  <UserCircleIcon />
                </span>
                <div>
                  <h4>{localStorage.getItem(AUTH.USER_NAME)}</h4>
                  <small>{localStorage.getItem(AUTH.USER_TYPE)}</small>
                </div>
              </p>
            </li>
            <li>
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                <span>
                  <UserRoundedFillIcon />
                </span>
                Profile
              </NavLink>
            </li>
            <li>
              <button onClick={logoutMutate}>
                <span>
                  <LogoutIcon />
                </span>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;

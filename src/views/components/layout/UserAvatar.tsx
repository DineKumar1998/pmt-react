import { useState, useRef, useEffect, useContext } from "react";

import Avatar from "@assets/Avatar.png";
import BackArrow from "../icons/BackArrow";
import { NavLink, useNavigate } from "react-router-dom";
import { LogoutIcon, UserCircleIcon, UserRoundedFillIcon } from "../icons";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../../apis/auth";
import { toast } from "react-toastify";
import { ASSETS_FOLDERS } from "@/utils/constants";
import AuthContext from "@/context/AuthContext";

const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useContext(AuthContext);

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
      logout();
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
    if (
      user.profile_img &&
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(user.profile_img)
    ) {
      return (
        <img
          src={ASSETS_FOLDERS.PROFILE + "/" + user.profile_img}
          alt="User Avatar"
        />
      );
    }

    return <img src={Avatar} alt="User Avatar" />;
  };

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
              <div className="username">
                <span>
                  <UserCircleIcon />
                </span>
                <div title={user.user_name}>
                  <h4>{user.user_name}</h4>
                  <small>{user.user_type}</small>
                </div>
              </div>
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

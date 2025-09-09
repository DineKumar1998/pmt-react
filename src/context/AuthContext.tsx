import { validateUser } from "@/apis/auth";
import { AUTH } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";
import { useLang } from "./LangContext";
// import { useCookies } from "react-cookie";
// import { AUTH } from "@/utils/constants";

const AuthContext = createContext<any>(null);

const getUserId = () => {
  // Split cookies into an array
  const cookies = document.cookie.split(";");

  let userInfoCookie = null;
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie !== undefined && trimmedCookie.startsWith(`${AUTH.USER_KEY}=`)) {
      console.log(trimmedCookie, "trim");
      // Extract and decode the value
      userInfoCookie = decodeURIComponent(trimmedCookie.substring(`${AUTH.USER_KEY}=`.length));
      break;
    }
  }
  return userInfoCookie ? JSON.parse(userInfoCookie) : "";
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { selectedLang } = useLang();
  // const [cookie, setCookie] = useCookies();

  const [user, setUser] = useState({
    // token: cookie?.[AUTH.TOKEN_KEY],
    // user_id: cookie?.userInfo?.id,
    user_id: getUserId(),
    user_name: "",
    profile_img: "",
    // user_type: cookie?.userInfo?.user_type || "",
    user_type: "",
  });

  // You can add methods to handle user authentication, logout, etc.
  const login = (
    // token: string,
    userId: string,
    firstName: string,
    lastName: string,
    profileImg: string,
    userType: string,
  ) => {
    const name = firstName + " " + lastName;
    setUser({
      // token: token,
      user_id: userId,
      user_name: name,
      profile_img: profileImg,
      user_type: userType,
    });
    // setCookie(AUTH.TOKEN_KEY, token, {
    //   path: "/",
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    // });
    // setCookie(
    //   AUTH.USER_KEY,
    //   JSON.stringify({
    //     user_id: userId,
    //     user_type: userType,
    //   }),

    //   { path: "/", expires: new Date(Date.now() + 24 * 60 * 60 * 1000) ,sameSite:'none', httpOnly:true}
    // );
  };

  const logout = () => {
    setUser({
      // token: "",
      user_id: "",
      user_name: "",
      profile_img: "",
      user_type: "",
    });

    // setCookie(AUTH.TOKEN_KEY, "", {
    //   path: "/",
    //   expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
    // });
    // setCookie(AUTH.USER_KEY, "", {
    //   path: "/",
    //   expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
    // });
  };
  const isLoggedIn = () => {
    return !!user.user_id;
  };
  // const isLoggedIn = () => {
  //   return !!user.token && !!cookie[AUTH.TOKEN_KEY];
  // };

  // const { data, isLoading ,error } = useQuery({
  //   queryKey: ["validate-user",user.token ,selectedLang],
  //   queryFn: () => validateUser(selectedLang),
  //   enabled:isLoggedIn(),
  //   retry:false
  // });
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["validate-user", selectedLang],
    queryFn: () => validateUser(selectedLang),
    enabled: isLoggedIn(),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && data?.userInfo) {
      setUser((prev) => {
        return {
          ...prev,
          user_id: data.userInfo.id,
          user_name: data.userInfo.first_name + " " + data.userInfo.last_name,
          profile_img: data.userInfo.profile_img,
          user_type: data.userInfo.user_type,
        };
      });
    }
    if (!isLoading && error) {
      logout();
    }
    // else{
    //   logout()
    // }
  }, [data, error, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
        isLoading: isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

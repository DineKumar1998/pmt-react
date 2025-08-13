import { validateUser } from "@/apis/auth";
import { AUTH } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookie, setCookie] = useCookies();
  const [user, setUser] = useState({
    token: cookie?.[AUTH.TOKEN_KEY],
    user_id: cookie?.user?.user_id,
    user_name: "",
    profile_img: "",
    user_type: cookie?.user?.user_type || "",
  });

  // You can add methods to handle user authentication, logout, etc.
  const login = (
    token: string,
    userId: string,
    firstName: string,
    lastName: string,
    profileImg: string,
    userType: string
  ) => {
    const name = firstName + " " + lastName;
    setUser({
      token: token,
      user_id: userId,
      user_name: name,
      profile_img: profileImg,
      user_type: userType,
    });
    setCookie(AUTH.TOKEN_KEY, token, {
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    setCookie(
      "user",
      JSON.stringify({
        user_id: userId,
        user_type: userType,
      }),

      { path: "/", expires: new Date(Date.now() + 24 * 60 * 60 * 1000) ,sameSite:'none', httpOnly:true}
    );
  };

  const logout = () => {
    setUser({
      token: "",
      user_id: "",
      user_name: "",
      profile_img: "",
      user_type: "",
    });
    setCookie("token", "", {
      path: "/",
      expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });
    setCookie("user", "", {
      path: "/",
      expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });
  };

  const isLoggedIn = () => {
    return !!user.token && !!cookie.token;
  };

  const { data, isLoading ,error } = useQuery({
    queryKey: ["validate-user",user.token],
    queryFn: () => validateUser(),
    enabled:isLoggedIn(),
    retry:false
  });

  useEffect(() => {
    if (!isLoading && data?.userInfo) {
      setUser((prev) => {
        return {
          ...prev,
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
  }, [data,error, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

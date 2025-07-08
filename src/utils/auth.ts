// import { AUTH } from "./constants";


// export const isLoggedIn = (): boolean => {
//   try {
//     const token = localStorage.getItem(AUTH.TOKEN_KEY);
//     if (!token) return false;

//     // const payload = JSON.parse(atob(token.split(".")[1]));
//     // const expiry = payload?.exp * 1000;
//     // if (Date.now() > expiry) {
//     //   localStorage.removeItem(TOKEN_KEY);
//     //   return false;
//     // }

//     return true;
//   } catch (error) {
//     console.error("Error validating auth token:", error);
//     localStorage.removeItem(AUTH.TOKEN_KEY);
//     return false;
//   }
// };

export const getRedirectPath = (isAuthenticated: boolean): string => {
  return isAuthenticated ? "/dashboard" : "/login";
};
// export const getUserType =()=> localStorage.getItem(AUTH.USER_TYPE)
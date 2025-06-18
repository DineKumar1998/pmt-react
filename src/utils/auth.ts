export const TOKEN_KEY = "token";

export const isLoggedIn = (): boolean => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // const payload = JSON.parse(atob(token.split(".")[1]));
    // const expiry = payload?.exp * 1000;
    // if (Date.now() > expiry) {
    //   localStorage.removeItem(TOKEN_KEY);
    //   return false;
    // }

    return true;
  } catch (error) {
    console.error("Error validating auth token:", error);
    localStorage.removeItem(TOKEN_KEY);
    return false;
  }
};

export const getRedirectPath = (isAuthenticated: boolean): string => {
  return isAuthenticated ? "/dashboard" : "/login";
};

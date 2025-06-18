import { ColorType } from "./types";

export const colorMap: Record<ColorType, string> = {
    purple: "#2F93FD",
    blue: "#77C7D7",
    green: "#049A26",
    orange: "#ebcb43",
    red: "#D50020",
    primary: "#68788D",
    secondary: "#C3CFE0",
    success: "#049A26",
    danger: "#D50020",
    info: "#77C7D7",
    warning: "#ebcb43",
    white: "#ffffff",
    black: "#000000",
    gray: "#808080",
    "gray-light": "#F5F7FA",
    "gray-dark": "#3f484f",
    "gray-primary": "#94A3B8",
    "gray-secondary": "#6B7C93",
    light: "#F5F7FA",
    "light-primary": "#F8FAFC",
    "light-secondary": "#F6F8FA",
    dark: "#3f484f",
    "dark-primary": "#475569",
    "dark-secondary": "#64748B",
    "purple-dark": "#1a1a39",
    "blue-dark": "#075985",
    "green-dark": "#024d14",
    "orange-dark": "#7d6700",
    "red-dark": "#460000",
    "purple-light": "#ffebf1",
    "blue-light": "#0284C7",
    "green-light": "#e8f4e6",
    "orange-light": "#fff9e6",
    "red-light": "#ffe7e9",
    "primary-light": "#fbac84",
    "secondary-light": "#77ff97",
    "secondary-dark": "#30A448",
    "light-opacity": "#ffffff4d",
};

// enum LeadStatusEnum {
//   Deleted // 0
//   Spam // 2
//   NBInc // 5
//   NBComp // 6
//   EBInc // 7
//   EBComp // 8
//   Verified // 9
// }
export const leadStatusColorMap: Record<string, keyof typeof colorMap> = {
    Deleted: "danger",
    Spam: "warning",
    NBInc: "primary",
    NBComp: "secondary",
    EBInc: "blue",
    EBComp: "info",
    Verified: "secondary",
};

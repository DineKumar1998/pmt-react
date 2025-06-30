interface BreadcrumbType {
    path: string;
    label: string;
}

export const breadcrumbsData: BreadcrumbType[] = [
    {
        path: "/dashboard",
        label: "dashboard",
    },
    {
        path: "/relationship-managers",
        label: "rm",
    },
    {
        path: "/relationship-managers/add-rm",
        label: "addUser",
    },
    {
        path: "/relationship-managers/edit-rm/:rmId",
        label: "editUser",
    },
    {
        path: "/client-list",
        label: "clientList",
    },
    {
        path: "/client-list/edit-client/:clientId",
        label: "editClient",
    },
    {
        path: "/manage-parameters",
        label: "manageParameters",
    },
    {
        path: "/manage-parameters/add-parameter",
        label: "addParameter",
    },
    {
        path: "/manage-parameters/edit-parameter/:editParamId",
        label: "editParameter",
    },
    {
        path: "/manage-weightage",
        label: "manageWeightage",
    },
    {
        path: "/manage-weightage/industry",
        label: "industry",
    },
    {
        path: "/profile",
        label: "profile",
    }
];
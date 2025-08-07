interface BreadcrumbType {
    path: string;
    label: string;
}

/**
http://localhost:5173/relationship-managers
    http://localhost:5173/relationship-managers/edit-rm/117
    http://localhost:5173/relationship-managers/rm?rmId=117&rmName=DInesh%20Kumar
        http://localhost:5173/manage-parameters/client?clientId=20&clientName=Upsilon%20United
        http://localhost:5173/manage-parameters/client?clientId=20&clientName=Upsilon+United&tab=secondary
            http://localhost:5173/manage-parameters/client/edit-parameter/4?clientName=Upsilon%20United

http://localhost:5173/member-list
    http://localhost:5173/member-list/edit-client/80
    http://localhost:5173/member-list/projects?clientId=80&clientName=Upsilon%20United
        http://localhost:5173/member-list/projects?clientId=20&clientName=Upsilon%20United
            http://localhost:5173/member-list/projects/mci?clientId=20&projectId=10&name=Project%20Kappa

    http://localhost:5173/manage-parameters/client?clientId=20&clientName=Upsilon%20United
    http://localhost:5173/manage-parameters/client?clientId=20&clientName=Upsilon+United&tab=secondary
        http://localhost:5173/manage-parameters/client/edit-parameter/4?clientName=Upsilon%20United


http://localhost:5173/manage-parameters
    http://localhost:5173/manage-parameters?tab=primary
    http://localhost:5173/manage-parameters?tab=secondary
        http://localhost:5173/manage-parameters/add-parameter
        http://localhost:5173/manage-parameters/edit-parameter/1
            http://localhost:5173/manage-parameters/client/edit-parameter/1/industry-map/This%20is%20kind%20of%20call

http://localhost:5173/manage-weightage
    http://localhost:5173/manage-weightage/industry?industryId=1&industryName=Agriculture
*/


export const breadcrumbMapping = Object.seal({
    'dashboard': 'Dashboard',
    'relationship-managers': "Relationship Managers",
    'member-list': "Member List",
    'members-list': "Members List",
    'member-edit': "Edit",
    'edit': "Edit",
    'add': "Add",
    'parameters': "Parameters",
    "edit-rm": "Edit Relationship Manager",
    'manage-parameters': "Manage Parameters",
    'manage-weightage': "Manage Weightage",
});

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
        path: "/relationship-managers/rm",
        label: "RM",
    },
    {
        path: "/member-list",
        label: "clientList",
    },
    {
        path: "/member-list/edit-client/:clientId",
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
        path: "/manage-parameters/client",
        label: "client",
    },
    {
        path: "/manage-parameters/client/edit-parameter/:editParamId",
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
        path: "/manage-weightage/client",
        label: "client",
    },
    {
        path: "/profile",
        label: "profile",
    },
    {
        path: "/member-list/parameters",
        label: "clientParameters",
    },
    {
        path: "/member-list/edit-parameter",
        label: "editParameter",
    },
    {
        path: "/member-list/projects",
        label: "clientProjects",
    },
];
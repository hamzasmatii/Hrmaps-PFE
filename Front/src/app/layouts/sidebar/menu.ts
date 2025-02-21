import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: 'MENUITEMS.DASHBOARDS.BADGE',
        },
        subItems: [
            {
                id: 3,
                label: 'SERVICE',
                link: '/dashboard/admin',
                parentId: 2
            },
            {
                id: 4,
                label: 'EMPLOYE',
                link: '/dashboard/admin/employe',
                parentId: 2
            },
            {
                id: 5,
                label: 'POSTE',
                link: '/dashboard/admin/poste',
                parentId: 2
            },
            {
                id: 6,
                label: 'FORMATION',
                link: '/dashboard/admin/calendrier',
                parentId: 2
            },
            
        ]
    },
    {
        id: 6,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: 'MENUITEMS.DASHBOARDS.BADGE',
        },
        subItems: [
            {
                id: 7,
                label: 'Profile',
                link: '/dashboard/chefdequipe/profile/{{idUser}}',
                parentId: 6
            },
            {
                id: 8,
                label: 'Service',
                link: '/dashboard/chefdequipe/serviceEq/{{idUser}}',
                parentId: 6
            },
            
        ]
    },

    {
        id: 10,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        badge: {
            variant: 'info',
            text: 'MENUITEMS.DASHBOARDS.BADGE',
        },
        subItems: [
            {
                id: 11,
                label: 'Profile',
                link: '/dashboard/employe/profile/{{idUser}}',
                parentId: 10
            },
            {
                id: 12,
                label: 'Formation',
                link: '/dashboard/employe/calendrier/{{idUser}}',
                parentId: 10
            },
           
            
        ]
    },
    
];


// import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/use-permission';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, BuildingIcon, ChevronRight, Globe, Globe2, LayoutGrid, MapPin, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/agents/dashboard',
        icon: LayoutGrid,
        isActive: false,
        roles: ['super-admin'],
    },
    {
        title: 'Countries in the World',
        href: '/agents/countries',
        icon: Globe2,
        isActive: false,
        roles: ['super-admin'],
    },
    {
        title: 'Representing Countries',
        href: '/agents/representing-countries',
        icon: Globe,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Countries',
                href: '/agents/representing-countries',
                roles: ['super-admin'],
            },
            {
                title: 'Add Country',
                href: '/agents/representing-countries/create',
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: 'Institution Management',
        href: '/agents/representing-institutions',
        icon: BuildingIcon,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Institutions',
                href: '/agents/representing-institutions',
                roles: ['super-admin'],
            },
            {
                title: 'Add Institution',
                href: '/agents/representing-institutions/create',
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: 'Branch Management',
        href: '/agents/branches',
        icon: MapPin,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Branches',
                href: '/agents/branches',
                roles: ['super-admin'],
            },
            {
                title: 'Add Branch',
                href: '/agents/branches/create',
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: 'Counsellor Management',
        href: '/agents/counsellors',
        icon: Users,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Counsellors',
                href: '/agents/counsellors',
                roles: ['super-admin'],
            },
            {
                title: 'Add Counsellor',
                href: '/agents/counsellors/create',
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: 'Processing Office',
        href: '/agents/processing-offices',
        icon: Building2,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Processing Offices',
                href: '/agents/processing-offices',
                roles: ['super-admin'],
            },
            {
                title: 'Add Processing Office',
                href: '/agents/processing-offices/create',
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: 'Associates',
        href: '/agents/associates',
        icon: Building2,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Associates',
                href: '/agents/associates',
                roles: ['super-admin'],
            },
            {
                title: 'Add Associate',
                href: '/agents/associates/create',
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: 'Counsellor Tools',
        href: '/agents/find-courses',
        icon: Building2,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'Find Courses',
                href: '/agents/find-courses',
                roles: ['super-admin'],
            },
        ],
    },

    {
        title: 'Lead Sources',
        href: '/agents/lead-sources',
        icon: Building2,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: 'All Lead Sources',
                href: '/agents/lead-sources',
                roles: ['super-admin'],
            },
            {
                title: 'Add Lead Source',
                href: '/agents/lead-sources/create',
                roles: ['super-admin'],
            },
        ],
    },

    {
        title: 'Dashboard',
        href: '/counsellors/dashboard',
        icon: LayoutGrid,
        isActive: false,
        roles: ['counsellor'],
    },
    {
        title: 'Dashboard',
        href: '/branch-office/dashboard',
        icon: LayoutGrid,
        isActive: false,
        roles: ['branch-office'],
    },
    {
        title: 'Counsellors',
        href: '/branch-office/counsellors',
        icon: Building2,
        isActive: false,
        roles: ['branch-office'],
        items: [
            {
                title: 'All Counsellors',
                href: '/branch-office/counsellors',
                roles: ['branch-office'],
            },
            {
                title: 'Add Counsellor',
                href: '/branch-office/counsellors/create',
                roles: ['branch-office'],
            },
        ],
    },
    {
        title: 'Associates',
        href: '/branch-office/associates',
        icon: Building2,
        isActive: false,
        roles: ['branch-office'],
        items: [
            {
                title: 'All Associates',
                href: '/branch-office/associates',
                roles: ['branch-office'],
            },
            {
                title: 'Add Associate',
                href: '/branch-office/associates/create',
                roles: ['branch-office'],
            },
        ],
    },
    // {
    //     title: "All Countries",
    //     href: "/agents/representing-countries",
    //     icon: Users,
    //     isActive: false,
    //     roles: ['super-admin'],
    //     items: [
    //         {
    //             title: "Representing Countries",
    //             href: "/agents/representing-countries",
    //         },
    //         {
    //             title: "Countries",
    //             href: "/agents/countries",
    //         },
    //     ],
    // }
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const page = usePage<SharedData>();
    const currentPath = page.url;
    const { hasRole } = usePermission();
    const { state } = useSidebar(); // 'expanded' or 'collapsed'

    // Filter navigation items based on user role
    const filteredNavItems = mainNavItems
        .filter((item) => {
            if (!item.roles) return true;
            return item.roles.some((role) => hasRole(role));
        })
        .map((item) => {
            if (item.items) {
                return {
                    ...item,
                    items: item.items.filter((subItem) => {
                        if (!subItem.roles) return true;
                        return subItem.roles.some((role) => hasRole(role));
                    }),
                };
            }
            return item;
        })
        .filter((item) => {
            if (item.items) {
                return item.items.length > 0;
            }
            return true;
        });

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/agents/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        {filteredNavItems.map((item) =>
                            item.items ? (
                                state === 'collapsed' ? (
                                    <Popover key={item.title}>
                                        <PopoverTrigger asChild>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton tooltip={item.title}>{item.icon && <item.icon />}</SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            side="right"
                                            align="start"
                                            className="w-52 rounded-lg border border-gray-200 bg-white p-0 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                                        >
                                            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400">
                                                {item.icon && <item.icon className="h-3 w-3 opacity-70" />}
                                                <span>{item.title}</span>
                                            </div>
                                            <ul>
                                                {item.items.map((subItem) => (
                                                    <li key={subItem.title}>
                                                        <Link
                                                            href={subItem.href}
                                                            className="block rounded px-4 py-2 text-sm transition-colors hover:bg-muted"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={currentPath.startsWith(item.href)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    className="data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:outline-border"
                                                    tooltip={item.title}
                                                >
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub className="mt-2">
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.href} prefetch>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={currentPath.startsWith(item.href)} tooltip={item.title}>
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ),
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

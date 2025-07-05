// import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, ChevronRight, Globe2, BuildingIcon, Users, BookOpen, Settings, MapPin, Globe } from 'lucide-react';
import AppLogo from './app-logo';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { usePermission } from '@/hooks/use-permission';
import { type SharedData } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/agents/dashboard",
        icon: LayoutGrid,
        isActive: false,
        roles: ['super-admin'],
    },
    {
        title: "Countries in the World",
        href: "/agents/countries",
        icon: Globe2,
        isActive: false,
        roles: ['super-admin'],

    },
    {
        title: "Representing Countries",
        href: "/agents/representing-countries",
        icon: Globe,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: "All Countries",
                href: "/agents/representing-countries",
                roles: ['super-admin'],
            },
            {
                title: "Add Country",
                href: "/agents/representing-countries/create",
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: "Institution Management",
        href: "/agents/representing-institutions",
        icon: BuildingIcon,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: "All Institutions",
                href: "/agents/representing-institutions",
                roles: ['super-admin'],
            },
            {
                title: "Add Institution",
                href: "/agents/representing-institutions/create",
                roles: ['super-admin'],
            },
        ],
    },
    {
        title: "Branch Management",
        href: "/agents/branches",
        icon: MapPin,
        isActive: false,
        roles: ['super-admin'],
        items: [
            {
                title: "All Branches",
                href: "/agents/branches",
                roles: ['super-admin'],
            },
            {
                title: "Add Branch",
                href: "/agents/branches/create",
                roles: ['super-admin'],
            },
        ],
    },


    {
        title: "Dashboard",
        href: "/counsellors/dashboard",
        icon: LayoutGrid,
        isActive: false,
        roles: ['counsellor'],
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

    // Filter navigation items based on user role
    const filteredNavItems = mainNavItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.some(role => hasRole(role));
    }).map(item => {
        if (item.items) {
            return {
                ...item,
                items: item.items.filter(subItem => {
                    if (!subItem.roles) return true;
                    return subItem.roles.some(role => hasRole(role));
                }),
            };
        }
        return item;
    }).filter(item => {
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
                        {filteredNavItems.map((item) => (
                            item.items ? (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={currentPath.startsWith(item.href)}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                className="data-[state=open]:bg-primary data-[state=open]:outline-border data-[state=open]:text-primary-foreground"
                                                tooltip={item.title}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub className='mt-2'>
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
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={currentPath.startsWith(item.href)}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        ))}
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

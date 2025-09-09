import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";

export function ProjectSidebar() {
  const [activeItem, setActiveItem] = useState("/");


  const sidebarItems = [
    { label: "Projects", icon: "mdi:folder", href: "/" },
    { label: "Templates", icon: "mdi:file-document-multiple-outline", href: "/about" },
    { label: "Documents", icon: "mdi:file-document-outline", extra: "+", href: "/about" },
    { label: "Community", icon: "mdi:account-group", badge: "NEW", href: "/about" },
    { label: "History", icon: "mdi:history", href: "/about" },
    { label: "Settings", icon: "mdi:cog-outline", section: "Settings & Help", href: "/about" },
    { label: "Help", icon: "mdi:help-circle-outline", section: "Settings & Help", href: "/about" },
  ];

  const handleNavigation = (href: string) => {
    setActiveItem(href);
    // window.location.href = href;
  };

  return (
    <div>

      <SidebarProvider id="2" className="w-fit bg-transparent   ">
      {/* triger for mobile view */}
           <span className="sm:block md:hidden">
           <SidebarTrigger  />
           </span>

      <Sidebar
        id="2"
        side="right"
        collapsible="icon"
        className="  border-r  border-gray-200 dark:bg-gray-900 dark:border-gray-700 bg-[#f7fbfc]"
        >
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-transparent focus-visible:ring-0 cursor-pointer z-10 dark:text-white  " />
            <SidebarGroupLabel className="flex items-center p-4 h-20">
              
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-500 dark:text-gray-400 ">
                  <Icon icon="qlementine-icons:stars-16" />
                  Navigation
                </div>
            </SidebarGroupLabel>
            </div>

            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      transition-colors duration-200
                    ${activeItem === item.href
                      ? "bg-white shadow-md rounded-md  justify-center py-2 "
                      : "text-gray-700  dark:text-white dark:hover:text-black py-1 hover:bg-white rounded-md "
                    }
                    `}
                    >
                    <SidebarMenuButton className="hover:bg-white focus:bg-white " asChild>
                      <a
                        href={item.href}
                        className="flex items-center space-x-3 w-full text-left rounded-md"
                      >
                        {item.icon && (
                          <Icon icon={item.icon} width={200} className="shrink-0" />
                        )}
                        <span className="text-md">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
                        </SidebarProvider>
    </div>
  );
}

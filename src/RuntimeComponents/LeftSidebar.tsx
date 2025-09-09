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
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import MotionWrapper from "@/RuntimeComponents/MotionWrapper";

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("/");
  const { state } = useSidebar();

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
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700  bg-[#f7fbfc] "
    >

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className={`flex items-center p-4 h-20 border-b-2 border-gray-500 rounded-none mb-4 ${
              state === "expanded" ? "justify-between" : "justify-center"
            }`}
          >
            <MotionWrapper from="top">
              {state === "expanded" && (
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-500 dark:text-gray-400">
                  <Icon icon="qlementine-icons:stars-16" />
                  Navigation
                </div>
              )}
            
            </MotionWrapper>
            <SidebarTrigger className="hover:bg-transparent focus-visible:ring-0 cursor-pointer z-10 dark:text-white " />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <MotionWrapper
                  key={item.label}
                  from="left"
                  delay={index * 0.05} // staggered animation
                >
                  <SidebarMenuItem
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      transition-colors duration-200
                      ${
                        activeItem === item.href
                          ? "bg-white shadow-md rounded-md justify-center py-1"
                          : "text-gray-700  dark:text-white dark:hover:text-black py-1 hover:bg-white rounded-md"
                      }
                    `}
                  >
                    <SidebarMenuButton className="hover:bg-white focus:bg-white" asChild>
                      <a
                        href={item.href}
                        className="flex items-center space-x-3 w-full text-left rounded-md"
                      >
                        {item.icon && (
                          <Icon
                            icon={item.icon}
                            width={22}
                            height={22}
                            className="shrink-0"
                          />
                        )}
                        <span className="text-md ">{  item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </MotionWrapper>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

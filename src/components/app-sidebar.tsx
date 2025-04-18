import { UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";

export const AppSidebar = () => {
  return (
    <Sidebar
      collapsible="none"
      className="sticky left-0 top-0 flex min-h-screen flex-col"
    >
      <SidebarHeader>
        <h1>Flashcards</h1>
      </SidebarHeader>
      <SidebarContent className="flex flex-1 flex-col"></SidebarContent>
      <SidebarFooter className="justify-end"></SidebarFooter>
    </Sidebar>
  );
};

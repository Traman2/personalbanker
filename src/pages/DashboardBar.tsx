import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
}

export function MenubarDemo({ name }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDashBoard = () => {
    navigate("/dashboard");
  };

  const handleSecurity = () => {
    navigate("/security");
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className=" px-4 py-1 rounded-lg font-semibold hover:bg-blue-100">
          {name}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Billing#</MenubarItem>
          <MenubarItem>Upgrade#</MenubarItem>
          <MenubarItem onClick={handleDashBoard}>Main Menu</MenubarItem>
          <MenubarItem onClick={handleLogout} className="text-red-500">
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger onClick={handleSecurity}>Security</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Balance</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Recent Transactions#</MenubarItem>
          <MenubarItem>Account Summary#</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

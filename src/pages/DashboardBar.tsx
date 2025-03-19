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

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleTransact = () => {
    navigate("/transact");
  };

  const handleCreation = () => {
    navigate("/creation");
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger
          className="
              px-4 py-1
              rounded-lg
            text-blue-700
              font-semibold
              transition duration-200
            hover:bg-amber-700
            hover:text-gray-200
            "
        >
          {name}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleDashBoard}>Overview</MenubarItem>
          <MenubarItem onClick={handleSettings}>Settings</MenubarItem>
          <MenubarItem>Billing#</MenubarItem>
          <MenubarItem>Upgrade#</MenubarItem>
          <MenubarItem onClick={handleLogout} className="text-red-500">
            Logout
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Security</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleSecurity}>Fraud Notices</MenubarItem>
          <MenubarItem>Recent Transactions#</MenubarItem>

        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Balance</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleTransact}>Transact</MenubarItem>
          <MenubarItem>Account Summary#</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Services</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={handleCreation}>New Account</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

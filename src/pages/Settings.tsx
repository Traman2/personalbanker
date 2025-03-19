import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MenubarDemo } from "@/pages/DashboardBar.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

//Shape of the mongodb schema
interface UserData {
  _id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
}

function Settings() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const fetchUserData = () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      axios
        .get("http://localhost:3000/user/me", {
          headers: {
            "x-auth-token": token,
          },
        })
        .then((response) => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error fetching user data:", err);
        });

      //Make another axios call for bank balances
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto"}>
      <MenubarDemo name={userData.userName}></MenubarDemo>
      <div className={"pt-4"}>
        <Card className="max-w-[1080px]">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Personally customize your personal banking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <Label className="mr-4">Light mode preference</Label>
              <ModeToggle></ModeToggle>
            </div>
            <div className="pt-2">
            <Button onClick={handleLogout}>Sign out</Button>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;

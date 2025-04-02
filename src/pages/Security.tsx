import { MenubarDemo } from "@/components/DashboardBar.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
//Shape of mongodb schema
interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
}

function Security() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div>{error}</div>;
  }
  else if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
  }
  else if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto"}>
        <MenubarDemo name={userData.userName}></MenubarDemo>
        <Card className="w-[400px] mt-4">
          <CardHeader>
            <CardTitle>Security Center</CardTitle>
            <CardDescription>Fraud Alert and detection</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pt-4 ">Work in progress...</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Security;

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

//Shape of the mongodb user schema
interface UserData {
  _id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
}

//Shape of mongodb account schema
interface UserAccount {
  _id: string;
  accountName: string;
  userName: string;
  userId: string;
  balance: number;
  accountNumber: string;
}

function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
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
          console.log("Success in reading user data")
          return axios.get(`http://localhost:3000/account/${userData?._id}`);
        })
        .then((accountResponse) => {
          setUserAccounts(accountResponse.data);
          console.log("Success in reading account data")
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error fetching user data:", err);
        });

      //Make another axios call for bank balances
    };

    fetchUserData();
  }, [userData?._id]);

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
      <div className={"pt-4 flex"}>
        <Card className="w-[400px] mr-3">
          <CardHeader>
            <CardTitle>Account info</CardTitle>
            <CardDescription>Personal Information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <p>{userData.userName}</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">ID</Label>
                <p>{userData._id}</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">First Name</Label>
                <p>{userData.firstName}</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Last Name</Label>
                <p>{userData.lastName}</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Primary Email address</Label>
                <p>{userData.email}</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Date of Birth</Label>
                <p>{new Date(userData.dob).toISOString().split("T")[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-[680px]">
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>List of all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {userAccounts.length > 0 ? (
              <div className="space-y-2">
                {userAccounts.map((account) => (
                  <div
                    key={account._id}
                    className="p-3 border rounded-lg flex flex-col"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {account.accountName}
                      </span>
                      <span>${account.balance.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Account No: {account.accountNumber}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No accounts found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;

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
  status: string;
  accountNumber: string;
}

// Shape of transaction schema
interface Transaction {
  _id: string;
  userId: string;
  accountNumber: string;
  transactionType: string;
  amount: number;
  recipientAccountNumber?: string;
  description?: string;
  previousBalance: number;
  newBalance: number;
  createdAt: string;
}

function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [accountTransactions, setAccountTransactions] = useState<{
    [accountNumber: string]: Transaction[];
  }>({});
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
        .then((userResponse) => {
          setUserData(userResponse.data);
          console.log("Success in reading user data");
          return axios.get(
            `http://localhost:3000/account/${userResponse.data._id}`,
          );
        })
        .then((accountResponse) => {
          setUserAccounts(accountResponse.data);
          console.log("Success in reading account data");

          const transactionPromises = accountResponse.data.map(
            (account: UserAccount) =>
              axios
                .get(
                  `http://localhost:3000/transactions/account/${account.accountNumber}`,
                )
                .then((transactionsResponse) => ({
                  accountNumber: account.accountNumber,
                  transactions: transactionsResponse.data,
                })),
          );

          return Promise.all(transactionPromises);
        })
        .then((accountTransactionData) => {
          const transactionsMap: { [accountNumber: string]: Transaction[] } =
            {};

          accountTransactionData.forEach((data) => {
            transactionsMap[data.accountNumber] = data.transactions;
          });
          setAccountTransactions(transactionsMap);
          console.log("Success in reading transaction data");
        })
        .catch((err) => {
          setError(err);
          console.error("Error fetching user data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchUserData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

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
    <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto "}>
      <MenubarDemo name={userData.userName}></MenubarDemo>
      <div className={"pt-4 flex flex-col"}>
        <div className={"flex"}>
          <Card className="w-[400px] mr-3 mb-3">
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

          <Card className="w-[680px] mb-3">
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>List of all accounts</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              {userAccounts.length > 0 ? (
                <div className="space-y-2">
                  {userAccounts.map((account) => (
                    <div
                      key={account._id}
                      className={`p-3 border rounded-lg flex flex-col ${
                        account.status === "Deactivated"
                          ? "bg-red-100 border-red-500"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <span
                          className={`font-semibold ${
                            account.status === "Deactivated"
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {account.accountName}
                          {account.status === "Deactivated" && (
                            <span className="ml-2 text-xs text-red-500">
                              (Deactivated)
                            </span>
                          )}
                        </span>
                        <span
                          className={`${
                            account.status === "Deactivated"
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {formatCurrency(account.balance)}
                        </span>
                      </div>
                      <div
                        className={`text-sm text-gray-500 mt-1 ${
                          account.status === "Deactivated" ? "text-red-500" : ""
                        }`}
                      >
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
        {userAccounts.map((account) => (
          <Card key={account.accountNumber} className="w-full mb-3">
            <CardHeader>
              <CardTitle>Recent Transactions - {account.accountName}</CardTitle>
              <CardDescription>
                {account.status === "Deactivated" && (
                  <p className=" font-bold text-xs text-red-500">
                    (Deactivated)
                  </p>
                )}
                <p>Account No. {account.accountNumber}</p>
                <p>Last 5 transactions</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {accountTransactions[account.accountNumber]?.length > 0 ? (
                <div className="space-y-2">
                  {accountTransactions[account.accountNumber]
                    ?.slice(0, 5)
                    .map((transaction) => (
                      <div
                        key={transaction._id}
                        className="p-3 border rounded-lg flex flex-col"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {transaction.transactionType}
                          </span>
                          <span>{formatCurrency(transaction.amount)}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </div>
                      </div>
                    )).reverse()}
                </div>
              ) : (
                <p>No recent transactions found for this account.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

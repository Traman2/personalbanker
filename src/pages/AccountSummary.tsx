import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenubarDemo } from "@/pages/DashboardBar.tsx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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
  status: string;
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

function TransactionPage() {
  const [userData, setUserData] = useState<UserData | null>(null);

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [accountTransactions, setAccountTransactions] = useState<{
    [accountNumber: string]: Transaction[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountData = () => {
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
          return axios.get(
            `http://localhost:3000/account/${userResponse.data._id}`,
          );
        })
        .then((accountResponse) => {
          setUserAccounts(accountResponse.data);

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
        //Returns an array of all the promises data
        .then((accountTransactionData) => {
          const transactionsMap: { [accountNumber: string]: Transaction[] } =
            {};
          accountTransactionData.forEach((data) => {
            transactionsMap[data.accountNumber] = data.transactions;
          });
          setAccountTransactions(transactionsMap);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchAccountData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  if (!userData) {
    return <div>No user data</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const labelsData = (accountNumber: string) => {
    return accountTransactions[accountNumber]
      .map((transaction) =>
        new Date(transaction.createdAt).toLocaleDateString(),
      )
      .reverse();
  };

  const data = (accountNumber: string) => {
    return {
      labels: labelsData(accountNumber),
      datasets: [
        {
          label: "Balance",
          data: accountTransactions[accountNumber]
            .map((transaction) => transaction.newBalance)
            .reverse(),
          fill: false,
          backgroundColor: "rgb(75, 192, 192)",
          borderColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total balance Over Time',
      },
    },
  };

  return (
    <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto"}>
      <MenubarDemo name={userData.userName}></MenubarDemo>

      <div className="mt-5 mb-4 rounded-lg mx-auto inline-block bg-opacity-50 backdrop-blur-md">
        <h1 className="text-2xl font-semibold p-3 text-black">
          Transaction History
        </h1>
      </div>

      {userAccounts.map((account) => (
        <Card key={account.accountNumber} className="mb-4">
          <CardHeader>
            <CardTitle
              className={`${account.status === "Deactivated" ? "text-red-600" : ""}`}
            >
              {account.accountName}
              {account.status === "Deactivated" && (
                <span className="ml-2 text-xs text-red-500">(Deactivated)</span>
              )}
            </CardTitle>
            <div className="flex justify-between items-center">
              <CardDescription
                className={`flex-1 ${
                  account.status === "Deactivated" ? "text-red-500" : ""
                }`}
              >
                Account Number: {account.accountNumber}
              </CardDescription>

              <CardDescription
                className={`flex-1 text-right ${
                  account.status === "Deactivated" ? "text-red-500" : ""
                }`}
              >
                Total Funds: {formatCurrency(account.balance)}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {accountTransactions[account.accountNumber]?.length > 1 ? (
              <div className="space-y-2 ">
                {accountTransactions[account.accountNumber]
                  ?.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((transaction) => (
                    <div
                      key={transaction._id}
                      className="p-3 border rounded-lg"
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
                      {transaction.recipientAccountNumber && (
                        <div className="text-sm text-gray-500 mt-1">
                          Recipient: {transaction.recipientAccountNumber}
                        </div>
                      )}
                      {transaction.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          Description: {transaction.description}
                        </div>
                      )}
                    </div>
                  ))}

                <div className="space-y-2 p-3 border rounded-lg">
                  {accountTransactions[account.accountNumber] && (
                    <Line data={data(account.accountNumber)} options={options}/>
                  )}
                </div>
              </div>
            ) : (
              <p>No transactions found for this account.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default TransactionPage;

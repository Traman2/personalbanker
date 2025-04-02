import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenubarDemo } from "@/components/DashboardBar.tsx";
import { Line } from "react-chartjs-2";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {Button} from "@/components/ui/button.tsx";

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

  const [showChart, setShowChart] = useState(false);
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

  if (error) {
    return <div>{error}</div>;
  } else if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  } else if (!userData) {
    return <div>No user data available.</div>;
  }

  const labelsData = (accountNumber: string) => {
    return accountTransactions[accountNumber]
      .map((transaction) =>
        new Date(transaction.createdAt).toLocaleDateString(),
      )
  };

  const data = (accountNumber: string) => {
    return {
      labels: labelsData(accountNumber),
      datasets: [
        {
          label: "Balance",
          data: accountTransactions[accountNumber]
            .map((transaction) => transaction.newBalance),
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
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total balance Over Time",
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
              <div>
                <Table>
                  <TableCaption>End of Transaction History</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accountTransactions[account.accountNumber]
                      ?.sort(
                        (a, b) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime(),
                      )
                      .map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell className="font-medium">
                            {transaction.transactionType}
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(account.balance)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                <div className="mt-5 border-t border-gray-300"></div>
                {showChart?
                    (<Button className="mt-4" onClick={() => setShowChart(false)}>
                      Hide chart
                    </Button>) :
                    (<Button className="mt-4" onClick={() => setShowChart(true)}>
                      Show chart
                    </Button>)
                }
                {showChart &&
                  <div className="space-y-2 p-3 mt-5 border rounded-lg">
                    {accountTransactions[account.accountNumber] && (
                      <Line
                        data={data(account.accountNumber)}
                        options={options}
                      />
                    )}
                  </div>
                }
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

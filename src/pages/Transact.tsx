import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
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

// Define schema for validation
const TransactSchema = z.object({
  accountNumber: z.string().min(5, "Enter a valid account number"),
  transactionType: z.enum(["deposit", "withdraw", "transfer"], {
    required_error: "Select a transaction type",
  }),
  amount: z.number().positive("Amount must be greater than zero"),
  recipientAccount: z.string().optional(), // Only needed for transfers
});

type TransactData = z.infer<typeof TransactSchema>;

function TransactionForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactData>({
    resolver: zodResolver(TransactSchema),
  });

  //All code to get username
  const [userData, setUserData] = useState<UserData | null>(null);
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
          if (response.data !== null) setUserData(response.data);
          setLoading(false);
          console.log("Success in reading user data");
        })
        .catch((err) => {
          setLoading(false);
          console.error("Error fetching user data:", err);
        });
    };

    fetchUserData();
  }, []);

  const toasterSuc = (transact:string, amo:number) => {
    toast.success(`Your ${transact} of $${amo} was completed`)
  }

  const toasterErr = (transact:string, amo:number) => {
    toast.error(`Your ${transact} of $${amo} was declined`)
  }

  const onSubmit = async (data: TransactData) => {
    setLoading(true);

    //Make the code handle transact and then redirect user back to dashboard
    try {
      const { accountNumber, transactionType, amount, recipientAccount } = data;

      if (transactionType === "deposit") {
        await axios
          .put(
            `http://localhost:3000/account/${accountNumber}/deposit`,
            { amount: amount },
            { headers: { "Content-Type": "application/json" } },
          )
          .then((response) => {
            console.log("Server Response: ", response);
            if (response.data.message === "Deposit successful") {
              toasterSuc(transactionType, amount);
            } else {
              console.error("Deposit didn't go through");
              toasterErr(transactionType, amount);
            }
          })
          .catch((error) => {
            console.error("Problem with deposit", error);
            toasterErr(transactionType, amount);
            setLoading(false);
          });
      } else if (transactionType === "withdraw") {
        await axios
          .put(
            `http://localhost:3000/account/${accountNumber}/withdraw`,
            { amount: amount },
            { headers: { "Content-Type": "application/json" } },
          )
          .then((response) => {
            console.log("Server Response: ", response);
            if (response.data.message === "Withdrawal successful") {
              toasterSuc(transactionType, amount);
            } else {
              console.error("Withdrawal didn't go through");
            }
          })
          .catch((error) => {
            console.error("Problem with withdrawal", error);
            toasterErr(transactionType, amount);
            setLoading(false);
          });
      } else if (transactionType === "transfer") {
        if (!recipientAccount) {
          toasterErr(transactionType, amount);
        }

        await axios
            .put(
                `http://localhost:3000/account/${accountNumber}/${recipientAccount}/transfer`,
                { amount: amount },
                { headers: { "Content-Type": "application/json" } },
            )
            .then((response) => {
              console.log("Server Response: ", response);
              if (response.data.message === "Transfer successful") {
                toasterSuc(transactionType, amount);
              } else {
                console.error("Transfer didn't go through");
                toasterErr(transactionType, amount);
              }
            })
            .catch((error) => {
              console.error("Problem with withdrawal", error);
              toasterErr(transactionType, amount);
              setLoading(false);
            });


      }
    } catch (error) {
      toast("Transaction Failed", {
        description: `Something went wrong: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto"}>
        <MenubarDemo name={userData.userName}></MenubarDemo>
        <Card className="w-[400px] mt-5">
          <CardHeader>
            <CardTitle>Transfer Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-2/3"
              >
                {/* Account Number Input */}
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Transaction Type Selector */}
                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdraw">Withdraw</SelectItem>
                          <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount Input */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recipient Account (only visible for transfers) */}
                {form.watch("transactionType") === "transfer" && (
                  <FormField
                    control={form.control}
                    name="recipientAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Account</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter recipient's account number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Submit Button */}
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default TransactionForm;

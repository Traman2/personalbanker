import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { MenubarDemo } from "@/components/DashboardBar.tsx";

// Shape of the mongodb user schema
interface UserData {
  _id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
}

// Define schema for validation
const AiTransactSchema = z.object({
  accountNumber: z.string().min(5, "Enter a valid account number"),
  aiFile: z.any().optional(),
});

type AiTransactData = z.infer<typeof AiTransactSchema>;

const AiTransactionPage = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AiTransactData>({
    resolver: zodResolver(AiTransactSchema),
  });

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
          setError("Failed to fetch user data.");
          console.error("Error fetching user data:", err);
        });
    };

    fetchUserData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const onSubmit = async (data: AiTransactData) => {
    setLoading(true);
    setError(null);

    try {
      const { accountNumber, aiFile } = data;

      if (!aiFile) {
        toast.error("Please select a file.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", aiFile);
      formData.append("accountNumber", accountNumber);

      const response = await axios.post(
        `http://localhost:3000/account/${accountNumber}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.message === "Transaction processed successfully") {
        toast.success(`Your ${response.data.aiResJSON.type === "withdraw"? "withdrawal" : "deposit"} of ${formatCurrency(response.data.aiResJSON.amount)} went through`);
        //  navigate("/dashboard"); // Removed navigate, keep it simple for this page
      } else {
        toast.error("Transaction failed");
        setError("Transaction failed");
      }
    } catch (error) {
      console.error("Error processing AI transaction:", error);
      toast.error("Failed to process transaction: " + error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto"}>
      <MenubarDemo name={userData.userName}></MenubarDemo>
      <Card className="w-[400px] mt-5">
        <CardHeader>
          <CardTitle>AI Transaction (Scan Receipt)</CardTitle>
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

              {/* File Input */}
              <FormField
                control={form.control}
                name="aiFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose File</FormLabel>
                    <FormControl>
                      <Input
                        id="file-input"
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="mb-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiTransactionPage;

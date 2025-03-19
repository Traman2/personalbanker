import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
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

const AccountCreationSchema = z.object({
  accountName: z.enum(["Checking", "CD", "Savings", "Investment"], {
    required_error: "Please select an account type",
  }),
});

type AccountCreationData = z.infer<typeof AccountCreationSchema>;

function BankAccountCreation() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<AccountCreationData>({
    resolver: zodResolver(AccountCreationSchema),
  });

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

  const onSubmit = async (data: AccountCreationData) => {
    setLoading(true);

    try {
      if (!userData) {
        toast.error("User data not available.");
        return;
      }
      await axios.post(
        "http://localhost:3000/account/create",
        {
          accountName: data.accountName,
          userId: userData._id,
        },
      );
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account.");
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
            <CardTitle>Create Bank Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-2/3"
              >
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Checking">Checking</SelectItem>
                          <SelectItem value="CD">CD</SelectItem>
                          <SelectItem value="Savings">Savings</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default BankAccountCreation;

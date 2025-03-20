// src/pages/DeleteAccount.js
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenubarDemo } from "@/pages/DashboardBar.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem, FormLabel,
} from "@/components/ui/form";

//Shape of the mongodb user schema
interface UserData {
  _id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
}


const DeleteAccountSchema = z.object({
  accountNumber: z
    .string()
    .length(12, "Account number must be exactly 12 digits"),
});

type DeleteAccountData = z.infer<typeof DeleteAccountSchema>;

function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<DeleteAccountData>({
    resolver: zodResolver(DeleteAccountSchema),
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

  const handleDelete = async (data: DeleteAccountData) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3000/account/${data.accountNumber}`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        },
      );
      toast.success("Account deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(
        `Failed to delete account: ${error}`
      );
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
    <div className={"pl-4 pr-4 pt-4 max-w-[1080px] mx-auto"}>
      <MenubarDemo name={userData.userName}></MenubarDemo>
      <Card className="w-[400px] mt-5">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleDelete)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="accountNumber">
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="accountNumber"
                        placeholder="Enter account number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Deleting..." : "Delete Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default DeleteAccount;

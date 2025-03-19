import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
//Form Validation and handler
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {useState} from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(9, "Password must be at least 9 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {


  const navigate = useNavigate(); //React router
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  const [setInvalidPass, setSetInvalidPass] = useState(false);
  //DATA IS COLLECTED HERE. Can send data to server
  const onSubmit = async (data: FieldValues) => {
    //added axios for token
    await axios
      .post("http://localhost:3000/auth", data)
      .then((response) => {
        const token = response.data;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
          console.error("No token received from server");
        }
      })
      .catch((error) => {
        console.error(
          "Login error: ",
          error.response?.data?.message || error.message,
        );
        setSetInvalidPass(true);
      });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Login with your account</CardDescription>
              {setInvalidPass && (
                  <p className="text-red-500 text-sm mt-2">Invalid email or password</p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <button
                          onClick={() => navigate("/signup")}
                          className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
                        >
                          Forgot your password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>{" "}
            (For testing purposes only) 2025.
          </div>
        </div>
      </div>
    </div>
  );
}

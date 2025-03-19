import axios from "axios";
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

//Form Validation and handler
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

//Calendar component
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useNavigate } from 'react-router-dom';
import {useState} from "react"; // Import useNavigate

const signupSchema = z.object({
  userName: z
    .string()
    .min(9, "Username should be at least 9 characters long")
    .max(20, "Username should not exceed 20 characters"),
  firstName: z.string().min(1, "Name must be at least 1 character"),
  lastName: z.string().min(1, "Name must be at least 1 character"),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(9, "Password must be at least 9 characters")
    .max(20, "Password must not exceed 20 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const [formError, setFormError] = useState(false)

  const dob = watch("dob"); // Watch DOB field for changes

  //DATA IS COLLECTED HERE. Can send data to server
  const onSubmit = async (data: FieldValues) => {
    console.log("Form submitted:", data);

    await axios
      .post("http://localhost:3000/user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Server Response: ", response);

        //Gets token from response
        const token = response.data;
        console.log(token);
        if (token) {
          localStorage.setItem('token', token); //store token.
          navigate('/dashboard'); // Navigate to dashboard
        } else {
          console.log()
          console.error("No token received from the server headers.");
          // Handle case where token is missing (e.g., show an error message)
        }
      })
      .catch((error) => {
        console.error("error submitting form: ", error);
        setFormError(true);
      });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Welcome to the next generation of Personal Banking
              </CardTitle>
              <CardDescription>
                Please fill out this application to get started
              </CardDescription>
              {formError && (
                  <p className="text-red-500 text-sm mt-2">Username or email is already taken</p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="userName">User Name</Label>
                      <Input
                        id="userName"
                        type="text"
                        {...register("userName")}
                      />
                      {errors.userName && (
                        <p className="text-red-500 text-sm">
                          {errors.userName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label>Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !dob && "text-muted-foreground",
                            )}
                          >
                            {dob ? (
                              format(dob, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dob}
                            onSelect={(date) => {
                              if (date) setValue("dob", date);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.dob && (
                        <p className="text-red-500 text-sm">
                          {errors.dob.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="text"
                        {...register("phoneNumber")}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

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
                      Signup
                    </Button>
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

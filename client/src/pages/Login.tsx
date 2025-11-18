import { loginSchema } from "@/schema/login";
import type { RootState } from "@/store";
import { useLoginMutation } from "@/store/slices/userApi";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LoginFormInputs } from "@/schema/login";
import { setUserInfo } from "@/store/slices/auth";

function Register() {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await loginMutation(data).unwrap();
      dispatch(setUserInfo(response));
      form.reset();
      toast.success("Register successful.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  return (
    <div className="max-w-[450px] lg:mx-auto mx-6 my-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold italic">LinkUp</CardTitle>
          <CardDescription>Enter your information to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="allison@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                Login
              </Button>
            </form>
          </Form>
          <p className="text-xs text-center font-medium mt-4">
            Don't have an account?
            <Link to={"/register"} className="underline ps-1">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;

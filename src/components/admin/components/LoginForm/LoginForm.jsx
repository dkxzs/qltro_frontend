import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { login } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = ({ className, ...props }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const mutationLogin = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await login(email, password);
      return res;
    },
    onSuccess: (res) => {
      if (+res.EC === 0) {
        // localStorage.setItem("token", res?.data?.token);
        toast.success("Đăng nhập thành công");
        navigate("/admin");
      } else {
        toast.error(res.EM);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutationLogin.mutate({
      email: formData.email,
      password: formData.password,
    });
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">Hệ thống quản lý phòng trọ</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Nhập tài khoản để đăng nhập vào hệ thống
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="abc@example.com"
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            placeholder="......"
            className="text-2xl"
            onChange={handleChange}
          />
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Đăng nhập
        </Button>
        {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div> */}
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
    </form>
  );
};

export default LoginForm;

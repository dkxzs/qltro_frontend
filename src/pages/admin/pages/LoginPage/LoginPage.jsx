import qltro from "@/assets/images/qltrologin.png";
import LoginForm from "@/components/admin/components/LoginForm/LoginForm";
import { SiGooglecampaignmanager360 } from "react-icons/si";
import "./LoginPage.scss";

const LoginPage = () => {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <SiGooglecampaignmanager360 className="size-7" />
              </div>
              <span className="fontFamily text-red-500 text-3xl">Tro247</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <img
            src={qltro}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

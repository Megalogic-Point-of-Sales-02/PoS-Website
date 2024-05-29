import ResetPassword from "@/modules/Authentication/ForgotPassword/ResetPassword";
import { Suspense } from "react";
const page = () => {
  return (
    <Suspense>
      <ResetPassword />;
    </Suspense>
  );
};

export default page;

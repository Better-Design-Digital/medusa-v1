import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminGetSession } from "medusa-react";

import LoginCard from "../components/organisms/login-card";
import ResetTokenCard from "../components/organisms/reset-token-card";
import SEO from "../components/seo";
import PublicLayout from "../components/templates/login-layout";

const LoginPage = () => {
  const [resetPassword, setResetPassword] = useState(false);

  const { user } = useAdminGetSession();

  const navigate = useNavigate();

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (window.location.search.includes("reset-password")) {
      setResetPassword(true);
    }
  }, []);

  const showLogin = () => {
    setResetPassword(false);
    navigate("/login", { replace: true });
  };

  const showResetPassword = () => {
    setResetPassword(true);
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <PublicLayout>
      <SEO title="Login" />
      {resetPassword ? (
        <ResetTokenCard goBack={showLogin} />
      ) : (
        <LoginCard
          toResetPassword={showResetPassword}
          toRegister={goToRegister} // Pass the goToRegister function as a prop
        />
      )}
    </PublicLayout>
  );
};

export default LoginPage;

import { useNavigate } from "react-router";
import { useAuth } from "../provider/authProvider";

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken();
    navigate("/home", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 1000);

  return <>Logout Page</>;
};

export default Logout;
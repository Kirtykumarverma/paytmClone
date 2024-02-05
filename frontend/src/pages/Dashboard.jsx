import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import FetchAllSercheduser from "../components/fetchAllSercheduser";
import { User } from "../components/User";
import accountService from "../backedncalls/account";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const fetchBalance = async () => {
    const res = await accountService.getBalance().then((res) => {
      if (res) {
        setBalance(res);
      }
    });
  };
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("accessToken");
    console.log("IS LOGGED IN :: " + isLoggedIn);
    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchBalance();
  }, []);
  return (
    <div>
      <Appbar />
      <div className="m-8">
        <Balance value={balance} />
        <User />
      </div>
    </div>
  );
};

import axios from "axios";

export class AccountService {
  async transferAmount({ amount, to }) {
    console.log(
      "ACCESS TOKEN IN BALANCE :: " + localStorage.getItem("accessToken")
    );
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL_ACCOUNT + "tranfer",
        {
          amount,
          to,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("TRANSFER " + res.data.data);
      return res;
    } catch (error) {
      console.error("ERROR IN TRANFER MONEY" + error.message);
    }
  }

  async getBalance() {
    console.log(
      "ACCESS TOKEN IN BALANCE :: " + localStorage.getItem("accessToken")
    );
    try {
      const url = import.meta.env.VITE_API_URL_ACCOUNT + "balance";
      console.log(url);
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const balance = res.data?.data?.balance.toFixed(2);
      return balance;
    } catch (error) {
      console.error("GET BALANCE" + error.message);
    }
  }
}

const accountService = new AccountService();
export default accountService;

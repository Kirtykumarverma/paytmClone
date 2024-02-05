import axios from "axios";

export class AuthService {
  async signin({ username, password }) {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL_USER + "signin",
        {
          username,
          password,
        }
      );
      const test = res.data;

      return test;
    } catch (error) {
      console.log("SIGN IN ERROR " + error);
    }
  }
  async signup({ username, firstName, lastName, password }) {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL_USER + "signup",
        {
          username,
          firstName,
          lastName,
          password,
        }
      );

      return res.data.message;
    } catch (error) {
      console.log("SIGN UP ERROR " + error);
    }
  }
  async updateUser({ firstName, lastName }) {
    try {
      const res = await axios.patch(
        import.meta.env.VITE_API_URL_USER + "update-account",
        {
          firstName,
          lastName,
        }
      );
      console.log("UPDATE USER " + res);
      console.log("UPDATE USER " + res.data);
      return res.data;
    } catch (error) {
      console.log("UPDATE USER ERROR " + error);
    }
  }

  async fetchUser({ filter }) {
    try {
      const url = `${
        import.meta.env.VITE_API_URL_USER
      }search?filter=${encodeURIComponent(filter)}`;
      console.log(url);
      const res = await axios.get(url);

      return res.data.data;
    } catch (error) {
      console.log("FETCH USER ERROR " + error);
    }
  }
}

const authService = new AuthService();
export default authService;

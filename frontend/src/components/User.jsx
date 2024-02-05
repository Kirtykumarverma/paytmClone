import React, { useEffect, useState } from "react";
import authService from "../backedncalls/user";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import FetchAllSercheduser from "./fetchAllSercheduser";

export const User = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchUserData = async () => {
    const res = await authService.fetchUser({ filter }).then((res) => {
      if (res) {
        setUsers(res.users);
      }
    });
    console.log("FETCH USER out :: " + res?.users);
  };
  useEffect(() => {
    fetchUserData();
  }, [filter]);
  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <FetchAllSercheduser key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

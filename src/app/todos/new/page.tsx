"use client";

import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import React, { useEffect, useState } from "react";

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export default function New() {
  const [user, setUser] = useState<IUser | null>(null);
  const loading = useLoading();

  useEffect(() => {
    (async () => {
      loading.toggle();
      const TOKEN = localStorage.getItem("TOKEN");
      const user_raw = await HasLoggedIn(TOKEN).finally(() => loading.toggle());
      if (!user_raw) localStorage.removeItem("TOKEN");
      setUser(user_raw);
    })();
  }, []);
  return (
    <>
      <Navbar user={user} />
    </>
  );
}

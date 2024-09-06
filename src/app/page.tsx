"use client";

import Loading from "@/components/loading/Loading";
import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import { useEffect, useState } from "react";

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export default function Home() {
  const [user, setUser] = useState<IUser | null>(null);
  const loading = useLoading();

  useEffect(() => {
    (async () => {
      loading.toggle();
      const storedToken = localStorage.getItem("TOKEN");

      const user_raw = await HasLoggedIn(storedToken).finally(() =>
        loading.toggle()
      );
      if (!user_raw) localStorage.removeItem("TOKEN");

      setUser(user_raw);
    })();
  }, [loading]);
  return (
    <>
      <Loading />
      <Navbar user={user} />
    </>
  );
}

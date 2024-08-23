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
      try {
        loading.toggle();
        const storedToken = localStorage.getItem("TOKEN");

        const user_raw = await HasLoggedIn(storedToken);
        if (!user_raw) throw new Error("User not authorized!");

        setUser(user_raw);
      } catch (err) {
        
      } finally {
        loading.toggle();
      }
    })();
  }, []);
  return (
    <>
      <Loading />
      <Navbar user={user} />
    </>
  );
}

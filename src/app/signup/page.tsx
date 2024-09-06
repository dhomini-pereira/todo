"use client";

import Loading from "@/components/loading/Loading";
import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { HasLoggedIn } from "@/services/HasLoggedIn";

type ISignUp = {
  name: string;
  email: string;
  password: string;
};

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export default function SignUp() {
  const { register, handleSubmit } = useForm<ISignUp>();
  const loading = useLoading();
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      loading.toggle();
      const token = localStorage.getItem("TOKEN");
      const user_raw = await HasLoggedIn(token).finally(() => loading.toggle());

      if (!user_raw) localStorage.removeItem("TOKEN");

      setUser(user_raw);
      return router.push("/");
    })();
  }, []);

  const handleSignUp = async (data: ISignUp) => {
    loading.toggle();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = new URL("/user/signup", API_URL).toString();

      const apiFetch = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await apiFetch.json();

      localStorage.setItem("TOKEN", response.token);
    } catch (err) {
      console.log(err);
    } finally {
      loading.toggle();
    }
  };

  return (
    <>
      <Navbar user={user} />
      <Loading />
      <div className="flex items-center justify-center content-center mt-[5%]">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-3">Register your account</h2>
            <form
              onSubmit={handleSubmit(handleSignUp)}
              className="flex flex-col gap-3"
            >
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="email"
                  className="grow"
                  placeholder="E-Mail"
                  {...register("email", { required: true })}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  className="grow"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
              </label>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" type="submit">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

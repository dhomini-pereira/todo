"use client";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export default function Navbar() {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const storedToken = localStorage.getItem("TOKEN");

      const user_raw = await HasLoggedIn(storedToken);
      if (!user_raw) return;

      setUser(user_raw);
    })();
  }, []);

  const logOut = () => {
    setUser(null);
    localStorage.removeItem("TOKEN");
    router.push("/");
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/">ToDo</a>
            </li>
            <li>
              <a href="/">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl" href="/">
          ToDo
        </a>
      </div>
      <div className="navbar-end gap-3">
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <input
            value="light"
            type="checkbox"
            className="toggle theme-controller"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
        </label>
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width="100"
                    height="100"
                  />
                ) : (
                  <div className="content-center justify-center h-full">
                    {user.name.toUpperCase().slice(0, 2)}
                  </div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <a>Dashboard</a>
              </li>
              <li>
                <a onClick={logOut}>Log out</a>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <a className="btn btn-ghost text-sm" href="/signin">
              SignIn
            </a>
            <a className="btn btn-primary text-sm" href="/signup">
              SignUp
            </a>
          </>
        )}
      </div>
    </div>
  );
}

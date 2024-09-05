"use client";

import Loading from "@/components/loading/Loading";
import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

type TodoList = {
  id: number;
  title: string;
  description?: string;
  status: "CANCELED" | "PENDING" | "DONE";
  createdAt: Date;
};

type ITodoResultRaw = {
  total: number;
  tasks: Array<TodoList>;
};

export default function Todos() {
  const [user, setUser] = useState<IUser | null>(null);
  const [tasks, setTasks] = useState<TodoList[] | []>([]);
  const loading = useLoading();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      loading.toggle();
      const token = localStorage.getItem("TOKEN");
      const user_raw = await HasLoggedIn(token);

      if (!user_raw) {
        loading.toggle();
        return router.push("/");
      }

      setUser(user_raw);

      loading.toggle();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = new URL("/task?page=1", API_URL);
      const token = localStorage.getItem("TOKEN");
      const tasks_raw = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!tasks_raw.ok) return;

      const result: ITodoResultRaw = await tasks_raw.json();

      setTasks(result.tasks);
    })();
  }, []);
  return (
    <>
      <Navbar user={user} />
      <Loading />
      <div className="overflow-x-auto ml-10 mr-10">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="font-bold">{task.title}</div>
                  </div>
                </td>
                <td>
                  {task.description}
                  <br />
                  <span className="badge badge-ghost badge-sm">
                    Desktop Support Technician
                  </span>
                </td>
                <td>{task.status}</td>
                <th>
                  <button className="btn btn-ghost btn-xs">{new Date(task.createdAt).toDateString()}</button>
                </th>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
        <div className="flex justify-center">
          <div className="join">
            <button className="join-item btn">1</button>
            <button className="join-item btn">2</button>
            <button className="join-item btn btn-disabled">...</button>
            <button className="join-item btn">99</button>
            <button className="join-item btn">100</button>
          </div>
        </div>
      </div>
    </>
  );
}

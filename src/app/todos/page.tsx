"use client";

import Loading from "@/components/loading/Loading";
import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import "./todo.css";
import { HttpInterceptor } from "@/services/HttpInterceptor";
import Link from "next/link";
import { useForm } from "react-hook-form";

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

enum Status {
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  DONE = "DONE",
}

type ISearch = {
  status?: Status | "Filter";
  text?: string;
};

type TodoList = {
  id: number;
  title: string;
  description?: string;
  status: Status;
  createdAt: Date;
};

type ITodoResultRaw = {
  total: number;
  tasks: Array<TodoList>;
};

export default function Todos() {
  const [user, setUser] = useState<IUser | null>(null);
  const [tasks, setTasks] = useState<TodoList[] | []>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { register, handleSubmit } = useForm<ISearch>();

  const loading = useLoading();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      loading.toggle();
      const token = localStorage.getItem("TOKEN");
      const user_raw = await HasLoggedIn(token);

      if (!user_raw) {
        loading.toggle();
        localStorage.removeItem("TOKEN");
        return router.push("/");
      }

      setUser(user_raw);

      loading.toggle();
    })();
  }, [loading]);

  useEffect(() => {
    (async () => {
      loading.toggle();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = new URL("/task", API_URL);
      const params = new URLSearchParams({
        page: String(page),
      });
      url.search = params.toString();

      const tasks_raw = await HttpInterceptor(url, {
        method: "GET",
      });

      if (!tasks_raw.ok) return;

      const result: ITodoResultRaw = await tasks_raw.json();

      setTotalPages(Math.ceil(result.total / 10));
      setTasks(result.tasks);
      loading.toggle();
    })();
  }, [page, loading]);

  const changeStatus = async (id: number, status: Status) => {
    loading.toggle();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL("/task/:id".replace(":id", String(id)), API_URL);

    const request = await HttpInterceptor(url, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    if (!request.ok) return;

    const result = await request.json();

    setTasks((prev) => {
      prev[prev.findIndex((task) => task.id === id)] = result;
      return prev;
    });

    loading.toggle();
  };

  const handleSearch = async (data: ISearch) => {
    if (data.status === "Filter") delete data.status;
    if (!data.text || data.text.trim() === "") delete data.text;

    loading.toggle();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL("/task", API_URL);
    const query = new URLSearchParams({ ...data, page: "1" });

    url.search = query.toString();

    const request = await HttpInterceptor(url, {
      method: "GET",
    }).finally(() => loading.toggle());

    if (!request.ok) return;

    const tasks = await request.json();

    setTasks(tasks.tasks);
    setPage(1);
    setTotalPages(Math.ceil(tasks.total / 10));
  };

  return (
    <>
      <Navbar user={user} />
      <Loading />
      <div className="flex justify-between mr-10 ml-10 gap-3 mb-3 mt-3">
        <form className="join" onSubmit={handleSubmit(handleSearch)}>
          <div>
            <div>
              <input
                className="input input-bordered join-item"
                placeholder="Search"
                {...register("text")}
              />
            </div>
          </div>
          <select
            className="select select-bordered join-item"
            defaultValue={"Filter"}
            {...register("status")}
          >
            <option value="Filter">Filter</option>
            <option value="CANCELED">CANCELED</option>
            <option value="PENDING">PENDING</option>
            <option value="DONE">DONE</option>
          </select>
          <div className="indicator">
            <button className="btn join-item">Search</button>
          </div>
        </form>
        <Link href="/todos/new" className="btn btn-outline btn-primary">
          New
        </Link>
      </div>
      <div className="overflow-x-auto ml-10 mr-10 flex flex-col gap-10">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="font-bold">{task.title}</div>
                  </div>
                </td>
                <td>{task.description}</td>
                <td>
                  <label className="form-control w-3/6">
                    <select
                      className={`select text-xs ${
                        task.status === "DONE"
                          ? "select-success"
                          : task.status === "CANCELED"
                          ? "select-error"
                          : "select-warning"
                      }`}
                      defaultValue={task.status}
                      onChange={async (e) => {
                        e.preventDefault();
                        await changeStatus(
                          task.id,
                          e.target.value.valueOf() as Status
                        );
                      }}
                    >
                      <option value={Status.CANCELED}>CANCELED</option>
                      <option value={Status.PENDING}>PENDING</option>
                      <option value={Status.DONE}>DONE</option>
                    </select>
                  </label>
                </td>
                <th>
                  <button className="btn btn-ghost btn-xs">
                    {new Date(task.createdAt).toDateString()}
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center">
          <div className="join">
            {Array.from({
              length: totalPages,
            }).map((_, i) => (
              <Fragment key={i}>
                <button
                  className="join-item btn"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

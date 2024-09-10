"use client";

import Loading from "@/components/loading/Loading";
import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, Suspense, useEffect, useState } from "react";
import "./todo.css";
import { HttpInterceptor } from "@/services/HttpInterceptor";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Table from "./components/table";
import Paginator from "@/components/paginator/Paginator";

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

function TodosContent() {
  const [user, setUser] = useState<IUser | null>(null);
  const [tasks, setTasks] = useState<TodoList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { register, handleSubmit } = useForm<ISearch>();
  const loading = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchUser = async () => {
    const token = localStorage.getItem("TOKEN");
    const user_raw = await HasLoggedIn(token);
    if (!user_raw) {
      localStorage.removeItem("TOKEN");
      router.push("/");
    } else {
      setUser(user_raw);
    }
  };

  const fetchTasks = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL("/task", API_URL);
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", params.get("page") || "1");

    url.search = params.toString();
    const tasks_raw = await HttpInterceptor(url, { method: "GET" });

    if (tasks_raw.ok) {
      const result: ITodoResultRaw = await tasks_raw.json();
      setTotalPages(Math.ceil(result.total / 10));
      setTasks(result.tasks);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      loading.toggle();
      await fetchUser();
      await fetchTasks();
      loading.toggle();
    };
    loadInitialData();
  }, [searchParams]);

  const changeStatus = async (id: number, status: Status) => {
    loading.toggle();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL(`/task/${id}`, API_URL);

    const request = await HttpInterceptor(url, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    if (request.ok) {
      const updatedTask = await request.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    }
    loading.toggle();
  };

  const handleSearch = (data: ISearch) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    data.status === "Filter"
      ? params.delete("status")
      : params.set("status", data.status || "");
    data.text ? params.set("text", data.text) : params.delete("text");

    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <Navbar user={user} />
      <Loading />
      <div className="flex justify-between mr-10 ml-10 gap-3 mb-3 mt-3">
        <form className="join" onSubmit={handleSubmit(handleSearch)}>
          <input
            className="input input-bordered join-item"
            placeholder="Search"
            {...register("text")}
          />
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
          <button className="btn join-item">Search</button>
        </form>
        <Link href="/todos/new" className="btn btn-outline btn-primary">
          New
        </Link>
      </div>
      <div className="overflow-x-auto ml-10 mr-10 flex flex-col gap-10">
        <Table tasks={tasks} changeStatus={changeStatus} />
        <Paginator
          page={Number(searchParams.get("page")) || 1}
          setPage={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", String(page));
            router.push(`?${params.toString()}`);
          }}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

export default function Todos() {
  return (
    <Suspense fallback={<Loading />}>
      <TodosContent />
    </Suspense>
  );
}

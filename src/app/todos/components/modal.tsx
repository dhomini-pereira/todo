import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../styles/modal.css";
import { HttpInterceptor } from "@/services/HttpInterceptor";

enum Status {
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  DONE = "DONE",
}

type Task = {
  title: string;
  description?: string;
  status: Status;
};

export default function Modal({
  setAlertProps,
}: {
  setAlertProps: (data: {
    type: "SUCCESS" | "ERROR" | "WARNING" | null;
    message: string | null;
  }) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Task>();

  const onSubmit = async (data: Task) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL("/task", API_URL);

    if (!data.description || data.description.trim() === "")
      delete data.description;

    const request = await HttpInterceptor(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!request.ok) return;

    reset();

    setAlertProps({
      type: "SUCCESS",
      message: "The task was created successfully!",
    });

    setTimeout(() => {
      setAlertProps({
        type: null,
        message: null,
      });
    }, 5000);
  };

  return (
    <>
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-new-todo form-control gap-4"
            id="form-new-todo"
          >
            <div className="input-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="input input-bordered join-item"
                {...register("title", { required: true })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="input input-bordered join-item"
                {...register("description")}
              />
            </div>
            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select
                className="select select-bordered join-item"
                defaultValue={"PENDING"}
                {...register("status", { required: true })}
              >
                <option value="PENDING">PENDING</option>
                <option value="CANCELED">CANCELED</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            <div className="modal-action">
              <label htmlFor="new-modal" className="btn">
                Close
              </label>
              <input
                className="btn btn-outline btn-primary"
                type="submit"
                value="Create"
                onClick={() => {
                  const buttonFechar = document.getElementById("new-modal");

                  if (!errors.title) buttonFechar?.click();
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

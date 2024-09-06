"use client";

import Alert from "@/components/alert/Alert";
import Loading from "@/components/loading/Loading";
import Navbar from "@/components/navbar/Navbar";
import { useLoading } from "@/contexts/LoadingContext";
import { HasLoggedIn } from "@/services/HasLoggedIn";
import { Buffer } from "buffer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type IUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

type IUpdateUser = {
  name?: string | null;
  file?: FileList | null;
};

type IAlertProps = {
  type: "ERROR" | "WARNING" | "SUCCESS" | null;
  message: string | null;
};

export default function Profile() {
  const [user, setUser] = useState<IUser | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string | null>(null);
  const [alert, setAlert] = useState<IAlertProps>({
    type: null,
    message: null,
  });
  const { register, handleSubmit, reset } = useForm<IUpdateUser>();
  const router = useRouter();
  const loading = useLoading();

  useEffect(() => {
    (async () => {
      loading.toggle();
      const token = localStorage.getItem("TOKEN");
      const user_raw = await HasLoggedIn(token);

      if (!user_raw) return router.push("/");

      setUser(user_raw);
      setOriginalImage(user_raw.avatarUrl || null);
      setOriginalName(user_raw.name);
      loading.toggle();
    })();
  }, [loading]);

  const handleFormSubmit = async (updateUser: IUpdateUser) => {
    try {
      loading.toggle();
      if (!updateUser.file && !updateUser.name) return;

      let avatarUrl;
      if (updateUser.file && updateUser.file.item(0)) {
        const arrayBuffer = await updateUser.file[0].arrayBuffer();
        avatarUrl = Buffer.from(arrayBuffer).toString("base64");
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = new URL("/user", API_URL);
      const token = localStorage.getItem("TOKEN");

      const user_raw = await fetch(url, {
        method: "PUT",
        body: JSON.stringify({ name: updateUser.name || undefined, avatarUrl }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!user_raw.ok) throw new Error("Ocorreu um erro ao enviar o update!");
      setAlert({
        type: "SUCCESS",
        message: "The user has been updated successfully!",
      });
    } catch (err) {
      setAlert({
        type: "ERROR",
        message: "Occurred an error in server. Try again later!",
      });
    } finally {
      loading.toggle();
      setTimeout(() => {
        setAlert({
          type: null,
          message: null,
        });
      }, 5000);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  const handleCancel = () => {
    setPreviewImage(originalImage);
    reset({ name: originalName, file: null });
  };

  return (
    <>
      <Navbar user={user} />
      <Alert type={alert.type} message={alert.message} />
      <Loading />
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col justify-center gap-5 h-fit w-full items-center"
      >
        <div className="avatar hover:brightness-50 hover:cursor-pointer relative h-40 w-40">
          <input
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            type="file"
            accept="image/png"
            {...register("file")}
            onChange={handleFileChange}
          />
          <div className="w-40 h-40 rounded-full overflow-hidden">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                width="100"
                height="100"
                className="w-full h-full object-cover"
                priority={true}
              />
            ) : originalImage ? (
              <Image
                src={originalImage}
                alt="Original"
                width="100"
                height="100"
                className="w-full h-full object-cover"
                priority={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {user?.name.toUpperCase().slice(0, 2)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm ml-1">
              Name:
            </label>
            <input
              id="name"
              type="text"
              defaultValue={user?.name || ""}
              {...register("name")}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-1">
              <label htmlFor="email">E-Mail:</label>
              <input
                id="email"
                type="text"
                className="input w-full max-w-xs"
                value={user?.email}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary">
            Save
          </button>

          <button
            type="button"
            className="btn btn-neutral"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

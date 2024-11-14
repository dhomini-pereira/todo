"use client";

import { useLoading } from "@/context/LoadingContext";
import api from "@/services/api.service";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { API_URL } from "../globals";
import { toast } from "react-toastify";

type InputCode = {
  userId: string;
  code: string;
};

export default function VerifyCode() {
  const { register, handleSubmit, setValue } = useForm<InputCode>({
    defaultValues: { userId: "" },
  });

  const searchParams = useSearchParams();
  const loading = useLoading();
  const router = useRouter();

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) setValue("userId", userId);
    else router.push("/");
  }, [searchParams, setValue]);

  const handleCode = async (data: InputCode) => {
    try {
      loading.toggle();
      const url = API_URL;
      await api.post(`${url}/auth/active-account`, data);
      toast.success("Conta ativada com sucesso!");
      router.push("/signin");
    } catch (err: any) {
      toast.error(err.response.data.error);
    } finally {
      loading.toggle();
    }
  };

  return (
    <>
      <header>
        <meta name="theme-color" content="#030B19" />
      </header>
      <div className="box w-full h-screen flex items-center justify-center flex-col font-body text-slate-200">
        <div className="max-sm:px-6 max-sm:max-w-xl max-sm:py-6 max-sm:w-5/6 w-3/5 h-fit max-w-md border border-blue-500 bg-slate-900 rounded-3xl py-9 px-12">
          <form
            className="grid gap-5 items-center"
            onSubmit={handleSubmit(handleCode)}
          >
            <div>
              <h1 className="text-4xl">Ativação de Conta</h1>
              <p className="font-light text-slate-400">
                Verifique o código enviado para o seu e-mail
              </p>
            </div>
            <input
              type="text"
              className="bg-slate-950 border-2 border-blue-500 rounded-md h-10 outline-none focus:border-blue-700 indent-3 ease-in duration-200"
              autoComplete="off"
              placeholder="Código"
              {...register("code")}
              maxLength={6}
              minLength={6}
              required
            />

            <button
              className="bg-blue-500 rounded-md h-10 hover:bg-blue-700 ease-in duration-200"
              type="submit"
            >
              Validar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

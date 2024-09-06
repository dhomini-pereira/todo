"use client";

export const HttpInterceptor = (
  input: string | URL | globalThis.Request,
  init?: RequestInit
) => {
  const TOKEN = localStorage.getItem("TOKEN");

  return fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};

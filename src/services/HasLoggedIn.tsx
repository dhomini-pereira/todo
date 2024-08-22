export const HasLoggedIn = async (token: string | undefined | null) => {
  if (!token) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = new URL("/user/hasloggedin", API_URL);

  const request = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!request.ok) return null;

  return request.json();
};

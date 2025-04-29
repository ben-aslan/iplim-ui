"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  username: z.string().trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username, password } = result.data;

  const urlencoded = new URLSearchParams();
  urlencoded.append("username", username);
  urlencoded.append("password", password);

  const res = await fetch(process.env.MARZ_ADDRESS + "/api/admins/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: urlencoded
  });

  if (!res.ok) {
    return {
      errors: {
        username: ["Invalid username or password"],
      },
    };
  }

  const data = await res.json()

  console.log(data)

  await createSession({ username: username, marzToken: data.access_token });

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
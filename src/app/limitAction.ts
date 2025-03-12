"use server";

import { z } from "zod";

const loginSchema = z.object({
    username: z.string().trim(),
    limit: z.string()
        .min(0, { message: "Password must be at least 8 characters" }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setUserLimit(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { username, limit } = result.data;

    console.log(username)
    console.log(limit)

    const token = (await (await fetch(process.env.LIM_ADDRESS + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": process.env.LIM_USER,
            "password": process.env.LIM_PASSWORD
        })
    })).json()).access_token;

    const res = await fetch(process.env.LIM_ADDRESS + "/update_special_limit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            "user": username,
            "limit": parseInt(limit)
        })
    });

    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: process.env.CHAT_ID,
            text: `user: ${username}\nlimit: ${limit}`,
        }),
    });

    if (!res.ok) {
        return {
            errors: {
                username: ["Invalid username or password"],
            },
        };
    }

    return {
        success: true
    }
}

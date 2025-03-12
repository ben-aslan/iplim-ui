import { jwtVerify } from "jose";

export async function getUsers(token: string) {
    const secretKey = process.env.SESSION_SECRET;
    const encodedKey = new TextEncoder().encode(secretKey);

    console.log(token)

    console.log(await (await fetch("https://console.mozikcade.ir/api/users", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": 'Bearer ' + (await (await jwtVerify(token, encodedKey, {
                algorithms: ["HS256"],
            }))).payload.marzToken
        },
    })).json())
}
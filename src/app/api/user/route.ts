import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { decrypt } from "@/app/lib/session";

export async function GET() {
    const cookieStore = cookies()
    const myCookie = (await cookieStore).get('session')

    const marzToken = (await decrypt(myCookie?.value))?.marzToken

    return NextResponse.json(await (await fetch("https://console.mozikcade.ir/api/users?page=1&size=100", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": 'Bearer ' + marzToken
            },
        })).json()
    )
}
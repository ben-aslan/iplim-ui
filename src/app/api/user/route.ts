import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { decrypt } from "@/app/lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL(req.url ?? '');
    const limit = searchParams.get('limit');
    const startIndex = searchParams.get('startIndex');

    const cookieStore = cookies()
    const myCookie = (await cookieStore).get('session')

    const marzToken = (await decrypt(myCookie?.value))?.marzToken

    return NextResponse.json(await (await fetch("https://console.mozikcade.ir/api/users?page=" + startIndex + 1 + "&size=" + limit + "&order_by=created_at&descending=true", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": 'Bearer ' + marzToken
        },
    })).json()
    )
}
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) {
    return new Response("Missing code in query string", { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    return new Response(JSON.stringify({ error: tokenData }), { status: 400 });
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const idToken = tokenData.id_token;

  const cookieStore = await cookies();
  cookieStore.set("ytmusic_access_token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });
  cookieStore.set("ytmusic_refresh_token", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  // TODO: Store tokens securely (database/session)
  // For now, display tokens for testing
  return new Response(`<pre>${JSON.stringify(tokenData, null, 2)}</pre>`, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const code = body.code;
  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), {
      status: 400,
    });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    return new Response(JSON.stringify({ error: tokenData }), { status: 400 });
  }

  // TODO: Store tokens securely (database/session)
  // For now, return tokens for testing
  return new Response(JSON.stringify(tokenData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


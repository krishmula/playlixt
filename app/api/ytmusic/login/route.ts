import { NextRequest } from "next/server";

// Load environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
console.log("CLIENT_ID", CLIENT_ID);
console.log("REDIRECT_URI", encodeURIComponent(REDIRECT_URI));

const SCOPE = [
  "https://www.googleapis.com/auth/youtube",
  "openid",
  "profile",
  "email",
].join(" ");

export async function POST(request: NextRequest) {
  // Build Google OAuth URL
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&access_type=offline&prompt=consent`;
  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";

async function handleLogin() {
  console.log("Login Button Clicked");
  window.location.href = "/api/login";
}

export default function Login() {
  return (
    <>
      <div className="p-10">
        <Button onClick={handleLogin}>Login To Spotify</Button>
      </div>
    </>
  );
}

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
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="p-10">
          <Button
            onClick={handleLogin}
            className="bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[color-mix(in srgb,var(--secondary),#000 20%)]"
          >
            Login To Spotify
          </Button>
        </div>
      </div>
    </>
  );
}

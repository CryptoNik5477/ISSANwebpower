"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-night-300 transition hover:bg-white/5 hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 text-text-light/70 hover:text-text-light transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </button>
  );
}

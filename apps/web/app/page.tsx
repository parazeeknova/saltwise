"use client";

import { AuthIsland } from "@bitwork/ui/auth/auth-island";
import { Button } from "@bitwork/ui/components/button";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <AuthIsland open={open} />
      <Button onClick={() => setOpen((prev) => !prev)}>
        {open ? "Hide Auth" : "Show Auth"}
      </Button>
    </main>
  );
}

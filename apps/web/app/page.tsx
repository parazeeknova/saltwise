import { Button } from "@bitwork/ui/components/button";
import { Suspense } from "react";
import { DbStatus } from "@/components/db-status";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed top-0 left-0 flex w-full justify-center border-gray-300 border-b bg-linear-to-b from-zinc-200 pt-8 pb-6 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-bold font-mono">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-linear-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
          <Suspense fallback={<div>Connecting to DB...</div>}>
            <DbStatus />
          </Suspense>
        </div>
      </div>

      <h1 className="font-bold text-4xl">Welcome to Bitwork!</h1>
      <Button>Click me</Button>
    </main>
  );
}

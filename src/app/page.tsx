"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles, SendHorizontal } from "lucide-react";

const page = () => {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const invoke = useMutation(trpc.invoke.mutationOptions({}));

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8 transition-all hover:shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center rotate-3 shadow-inner transition-transform hover:rotate-6 hover:scale-105 duration-300">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              What is your wish?
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Ask Genie to perform any task for you.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., Deploy my application..."
              className="w-full pl-5 pr-14 py-7 text-lg rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && value.trim()) {
                  invoke.mutate({ value });
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                size="icon"
                onClick={() => {
                  invoke.mutate({ value });
                }}
                disabled={invoke.isPending || !value.trim()}
                className="h-11 w-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-105 active:scale-95"
              >
                <SendHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {invoke.isPending && (
            <div className="text-blue-500 text-sm text-center animate-pulse">
              Genie is processing your request...
            </div>
          )}

          {invoke.isError && (
            <div className="text-red-500 text-sm text-center">
              An error occurred while communicating with Genie.
            </div>
          )}

          {invoke.isSuccess && (
            <div className="text-green-500 text-sm text-center">
              Your wish has been granted!
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default page;

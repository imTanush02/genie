"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const page = () => {
  const router = useRouter()
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess : (data)=>{
        router.push(`/projects/${data.id}`)
      }
    }),
  );

  useEffect(() => {
    // Force dark mode on document body to ensure Shadcn UI matches
    document.documentElement.classList.add("dark");
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-xl flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe your app..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              createProject.mutate({ value });
            }
          }}
        />
        <Button
          onClick={() => {
            createProject.mutate({ value });
          }}
          disabled={createProject.isPending || !value.trim()}
        >
          {createProject.isPending ? "Creating..." : "Submit"}
        </Button>
      </div>
    </main>
  );
};

export default page;

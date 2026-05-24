"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Sparkles, Wand2, ExternalLink, User, Bot } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);

  const {data: messages, isLoading: messagesLoading} = useQuery(trpc.messages.getMany.queryOptions())

  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message created successfully");
      setValue("");
      queryClient.invalidateQueries({ queryKey: trpc.messages.getMany.queryOptions().queryKey });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  }))

  useEffect(() => {
    // Force dark mode on document body to ensure Shadcn UI matches
    document.documentElement.classList.add("dark");
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] p-4 pt-12 selection:bg-blue-500/30">
      <div className="w-full max-w-2xl p-1 relative">
        {/* Glow effect behind the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl rounded-[32px] -z-10 opacity-70 animate-pulse duration-3000"></div>
        
        <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[30px] p-8 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
          
          {/* Top Decorative edge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              <div className="relative h-24 w-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 text-blue-400 rounded-3xl flex items-center justify-center shadow-inner transition-all group-hover:scale-105 group-hover:rotate-3 duration-500">
                <Wand2 className="w-10 h-10" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                What is your wish?
              </h1>
              <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                Describe your dream application, and watch Genie bring it to life instantly.
              </p>
            </div>
          </div>

          <div className="space-y-6 relative z-10 w-full max-w-xl mx-auto">
            <div className="relative group">
              {/* Outer glow for input */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-[20px] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., Build a modern SaaS landing page..."
                className="relative w-full pl-6 pr-16 py-8 text-lg md:text-xl rounded-[20px] border-white/10 bg-black/60 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-blue-500/50 shadow-inner transition-all h-16"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && value.trim()) {
                    createMessage.mutate({ value });
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  size="icon"
                  onClick={() => {
                    createMessage.mutate({ value });
                  }}
                  disabled={createMessage.isPending || !value.trim()}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                >
                  <Sparkles className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Status indicator */}
            <div className="h-8 flex justify-center items-center">
              {createMessage.isPending && (
                <div className="flex items-center space-x-3 text-blue-400 text-sm font-medium animate-pulse">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Genie is weaving magic...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {messages && messages.length > 0 && (
        <div className="w-full max-w-2xl mt-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 px-2">Conversation</h2>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed transition-all ${
                    msg.role === "USER"
                      ? "bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/20 text-white"
                      : "bg-white/[0.05] border border-white/[0.08] text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {msg.role === "USER" ? (
                      <User className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span className={`text-xs font-medium ${
                      msg.role === "USER" ? "text-blue-400" : "text-purple-400"
                    }`}>
                      {msg.role === "USER" ? "You" : "Genie"}
                    </span>
                    <span className="text-[10px] text-zinc-600 ml-auto">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.fragment && (
                    <a
                      href={msg.fragment.sandboxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Live Preview
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {messagesLoading && (
        <div className="w-full max-w-2xl mt-8 flex justify-center">
          <div className="flex items-center space-x-3 text-zinc-500 text-sm">
            <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading messages...</span>
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </main>
  );
};

export default page;

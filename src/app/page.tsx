"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}))
  return <div>
    <Button onClick={()=>{invoke.mutate({text:"hello"})}}>  invoke </Button>
  </div>;
}

export default page
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { Client } from "./client";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.hello.queryOptions({text:"sTNAUSH"}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<h1>Loading ...</h1>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;

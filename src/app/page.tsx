"use client";

import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query';
import React from 'react'

const page = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "tanush" }))
  return (
    <div>
      <h1>{data?.greeting}</h1>
    </div>
  )
}

export default page
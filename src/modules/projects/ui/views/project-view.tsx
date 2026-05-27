"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "@/modules/projects/ui/components/messages-container";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/client";
interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className="h-screen">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className=" flex flex-col min-h-0"
        >
          <Suspense fallback={"Loading Messages"}>
            <MessagesContainer 
              projectId={projectId} 
              activeFragment={activeFragment} 
              setActiveFragment={setActiveFragment} 
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={65}
          minSize={50}
          className=" flex flex-col min-h-0"
        >
          TODO:preview
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

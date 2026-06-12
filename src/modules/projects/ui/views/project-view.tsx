"use client";

import { Suspense, useState } from "react";
import { EyeIcon, CodeIcon, DownloadIcon } from "lucide-react";

import { Fragment } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { FragmentWeb } from "../components/fragment-web";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/messages-container";
import { ErrorBoundary } from "react-error-boundary";
import { FileExplorer } from "@/components/file-explorer";
import { NEXTJS_BOILERPLATE } from "@/lib/boilerplate";

interface Props {
  projectId: string;
};

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  const handleDownload = async () => {
    if (!activeFragment?.files) return;
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    
    // Merge boilerplate and generated files (generated files override boilerplate)
    const allFiles = {
      ...NEXTJS_BOILERPLATE,
      ...(activeFragment.files as Record<string, string>)
    };

    Object.entries(allFiles).forEach(([path, content]) => {
      zip.file(path, content);
    });
    
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-${projectId}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary fallback={<p>Project header error</p>}>
            <Suspense fallback={<p>Loading project...</p>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<p>Messages container error</p>}>
            <Suspense fallback={<p>Loading messages...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>


        <ResizableHandle className="hover:bg-primary transition-colors" />

        
        <ResizablePanel
          defaultSize={65}
          minSize={50}
        >
          <Tabs
            className="h-full gap-y-0 flex flex-col"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!!activeFragment?.files && Object.keys(activeFragment.files).length > 0 && (
                  <Button size="sm" variant="outline" onClick={handleDownload} className="gap-x-2">
                    <DownloadIcon className="size-4" /> <span>Download</span>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        
      </ResizablePanelGroup>
    </div>
  );
};
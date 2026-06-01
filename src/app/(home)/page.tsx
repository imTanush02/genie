import Image from "next/image";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="relative flex flex-col items-center justify-center space-y-8 py-[16vh] 2xl:py-48 mt-10">
        {/* Glow effect behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="flex flex-col items-center relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/logo.svg"
            alt="Genie"
            width={64}
            height={64}
            className="hidden md:block relative z-10 drop-shadow-[0_0_15px_rgba(201,99,66,0.5)] transition-transform duration-500 hover:scale-110"
          />
        </div>
        
        <div className="space-y-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Build something with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-yellow-500 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Genie
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150 fill-mode-both">
            Create apps and websites by simply chatting with AI.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto w-full z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
};
 
export default Page;
// import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return ( 
    <main className="flex flex-col min-h-screen max-h-screen">
      {/* <Navbar /> */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="fixed inset-0 -z-10 h-full w-full  overflow-hidden">
        {/* Magical ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/20 blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-orange-500/10 blur-[100px] mix-blend-screen opacity-40" />
      </div>
      <div className="flex-1 flex flex-col px-4 pb-4">
        {children}
      </div>
    </main>
  );
};
 
export default Layout;
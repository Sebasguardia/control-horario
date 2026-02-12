import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-white dark:bg-black p-2 lg:p-3 gap-2 lg:gap-3 overflow-hidden transition-colors duration-300">
            {/* Sidebar Section - Narrower (w-64 instead of w-72) */}
            <div className="hidden lg:flex flex-col w-64 shrink-0 rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 overflow-hidden transition-all duration-300 border border-transparent dark:border-slate-800/50">
                <Sidebar />
            </div>

            {/* Main Content Viewport */}
            <div className="flex flex-1 flex-col gap-2 lg:gap-3 min-w-0">
                {/* Navbar Section */}
                <div className="h-20 shrink-0 rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 flex items-center relative z-20 transition-all duration-300 border border-transparent dark:border-slate-800/50">
                    <Navbar />
                </div>

                {/* Main Viewport Section */}
                <main className="flex-1 rounded-[1.5rem] bg-[#F7F8F9] dark:bg-slate-900 overflow-hidden relative transition-all duration-300 border border-transparent dark:border-slate-800/50">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

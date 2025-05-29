import PortfolioHeader from "@/components/portfolio-header";
import { getPersonalData } from "@/lib/data";
import { Profile } from "@/components/profile";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { VisitorCount } from "@/components/visitor-count";

export default function Home() {
  const fullName = getPersonalData().name;
  return (
    <main className="min-h-screen font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <PortfolioHeader />
      <div className="relative z-10 container mx-auto p-3 sm:p-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Profile section */}
          <div className="flex flex-col space-y-4 sm:space-y-6 md:sticky md:top-20 self-start items-stretch">
            <Profile />
            <VisitorCount />
          </div>
          {/* Main content section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-6">
            <Experience />
            <Projects />
            <Skills />
            <Education />
          </div>
        </div>
      </div>
      <footer className="mt-8 py-4 text-center text-stone-400 text-xs">
        <p>
          © {new Date().getFullYear()} {fullName}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

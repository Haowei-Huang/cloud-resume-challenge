"use client";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectsData } from "@/lib/data";
import { FolderGit2 } from "lucide-react";
import { ProjectCard } from "@/components/project-card";

export function Projects() {
    const experienceData = getProjectsData();

    return (
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm text-white" id="projects">
            <CardContent className="px-6">
                <div className="flex items-center mb-4">
                    <FolderGit2 className="w-6 h-6 mr-3 text-cyan-400" />
                    <h3 className="text-lg font-medium text-white">
                        Projects
                    </h3>
                </div>
                {/* Projects items */}
                <div className="mt-1 flex flex-col gap-6">
                    {experienceData.map((item) => (
                        <ProjectCard data={item} key={item.name} />))
                    }
                </div>
            </CardContent>
        </Card >
    );
}

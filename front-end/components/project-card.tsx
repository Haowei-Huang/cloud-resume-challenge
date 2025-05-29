"use client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"


interface Project {
    name: string;
    dates: string;
    description: string;
    details: string[];
    technologies: string[];
    links?: {
        demoUrl?: string;
        githubUrl?: string;
    }
}

interface ProjectCardProps {
    data: Project;
}

export function ProjectCard({ data }: ProjectCardProps) {
    return (
        <div className="space-y-4 pb-6 border-b border-stone-800 last:border-0 last:pb-0">
            <div className="flex justify-between items-center">
                <h5 className="font-medium text-xl">
                    {data.name}
                </h5>
                <p className="text-sm text-stone-400 ">
                    {data.dates}
                </p>
            </div>

            {data.description && <p className="text-stone-300">
                {data.description}
            </p>}
            <div className="space-y-3">
                <h5 className="text-base text-stone-400 font-medium">
                    Key Achievements
                </h5>
                <ul className="space-y-2">
                    {
                        data.details.map((item, index) => (
                            <li key={index} className="flex text-base  text-stone-200">
                                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0 text-cyan-400 mt-1" />
                                <p>{item}</p>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="mt-3">
                <h5 className="text-base text-stone-400 font-medium mb-2">
                    Technologies
                </h5>
                <div className="flex flex-wrap gap-2">
                    {data.technologies.map((item) => (
                        <Badge key={item} variant="outline" className="text-sm text-stone-300 bg-stone-800/50 hover:bg-stone-800">
                            {item}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
                {data.links?.demoUrl && (
                    <Button
                        asChild
                        size="sm"
                        className="text-black bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xs sm:text-sm"
                    >
                        <a href={data.links?.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            View Live Project
                        </a>
                    </Button>
                )}
                {data.links?.githubUrl && (
                    <Button asChild size="sm" className="text-stone-300 border border-stone-300 bg-black hover:bg-stone-900 hover:text-stone-300 text-xs sm:text-sm ">
                        <a href={data.links?.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            View Source Code
                        </a>
                    </Button>
                )}
            </div>
        </div>
    );
}
"use client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface Experience {
    title: string;
    company: string;
    location: string;
    dates: string;
    description?: string;
    responsibilities: string[];
    skills: string[];
}

interface ExperienceCardProps {
    data: Experience;
}

export function ExperienceCard({ data }: ExperienceCardProps) {
    return (
        <div className="space-y-4 pb-6 border-b border-stone-800 last:border-0 last:pb-0">
            <div>
                <div className="flex justify-between items-center">
                    <h5 className="font-medium text-xl">
                        {data.title}
                    </h5>
                    <p className="text-sm text-stone-400 ">
                        {data.dates}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <h5 className="text-base text-cyan-400 ">
                        {data.company}
                    </h5>
                    <p className="text-sm text-stone-400 ">
                        {data.location}
                    </p>
                </div>
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
                        data.responsibilities.map((item, index) => (
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
                    Technologies & Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((item) => (
                        <Badge key={item} variant="outline" className="text-sm text-stone-300 bg-stone-800/50 hover:bg-stone-800">
                            {item}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
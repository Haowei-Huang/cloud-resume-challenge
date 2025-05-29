"use client";
import { Card, CardContent } from "@/components/ui/card";
import { BriefcaseBusiness } from "lucide-react";
import { getExperienceData } from "@/lib/data";
import { ExperienceCard } from "@/components/experience-card";

export function Experience() {
    const experienceData = getExperienceData();

    return (
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm text-white" id="experience">
            <CardContent className="px-6">
                <div className="flex items-center mb-4">
                    <BriefcaseBusiness className="w-6 h-6 mr-3 text-cyan-400" />
                    <h3 className="text-lg font-medium text-white">
                        Experience
                    </h3>
                </div>
                {/* Experience items */}
                <div className="mt-1 flex flex-col gap-6">
                    {experienceData.map((item) => (
                        <ExperienceCard data={item} key={item.company} />))
                    }
                </div>
            </CardContent>
        </Card >
    );
}

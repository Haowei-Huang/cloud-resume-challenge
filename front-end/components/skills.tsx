"use client";
import { getSkillsData } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { CodeIcon } from "lucide-react";
import { Badge } from "./ui/badge";
export function Skills() {
    const skillsData = getSkillsData();

    return (
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm" id="skills">
            <CardContent className="px-4 sm:px-6">
                <div className="flex items-center mb-4">
                    <CodeIcon className="w-6 h-6 mr-3 text-cyan-400" />
                    <h3 className="text-lg font-medium text-white">
                        Technical Skills
                    </h3>
                </div>
                {/* Skills items */}
                <div className="mt-1 grid sm:grid-cols-1 md:grid-cols-2 md:gap-4 sm:gap-6">
                    <div className="space-y-3">
                        <h4 className="text-base font-medium text-stone-200">
                            Languages
                        </h4>
                        <div className="flex flex-wrap gap-2 ">
                            {skillsData.languages.map((item) => (
                                <Badge key={item} className="px-2 py-1 text-sm text-stone-300 rounded-full bg-stone-800 hover:bg-stone-700">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-base font-medium text-stone-200">
                            Backend
                        </h4>
                        <div className="flex flex-wrap gap-2 ">
                            {skillsData.backend.map((item) => (
                                <Badge key={item} className="px-2 py-1 text-sm text-stone-300 rounded-full bg-stone-800 hover:bg-stone-700">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-base font-medium text-stone-200">
                            Databases
                        </h4>
                        <div className="flex flex-wrap gap-2 ">
                            {skillsData.databases.map((item) => (
                                <Badge key={item} className="px-2 py-1 text-sm text-stone-300 rounded-full bg-stone-800 hover:bg-stone-700">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-base font-medium text-stone-200">
                            Frontend
                        </h4>
                        <div className="flex flex-wrap gap-2 ">
                            {skillsData.frontend.map((item) => (
                                <Badge key={item} className="px-2 py-1 text-sm text-stone-300 rounded-full bg-stone-800 hover:bg-stone-700">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-base font-medium text-stone-200">
                            Testing & Quality
                        </h4>
                        <div className="flex flex-wrap gap-2 ">
                            {skillsData.testing.map((item) => (
                                <Badge key={item} className="px-2 py-1 text-sm text-stone-300 rounded-full bg-stone-800 hover:bg-stone-700">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-base font-medium text-stone-200">
                            DevOps & Tools
                        </h4>
                        <div className="flex flex-wrap gap-2 ">
                            {skillsData.devops.map((item) => (
                                <Badge key={item} className="px-2 py-1 text-sm text-stone-300 rounded-full bg-stone-800 hover:bg-stone-700">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
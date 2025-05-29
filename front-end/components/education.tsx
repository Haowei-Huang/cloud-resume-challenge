import { GraduationCap } from "lucide-react";
import { CardContent } from "./ui/card";
import { Card } from "./ui/card";
import { getEducationData } from "@/lib/data";
import Image from "next/image";

export function Education() {
    const educationData = getEducationData();

    return (
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm text-white" id="education">
            <CardContent className="px-6">
                <div className="flex items-center mb-4 sm:mb-6">
                    <GraduationCap className="w-6 h-6 mr-3 text-cyan-400" />
                    <h3 className="text-lg font-medium text-white">
                        Education
                    </h3>
                </div>
                {/* Education items */}
                <div className="mt-2 space-y-3 md:space-y-4">
                    {educationData.map((item) => (
                        <div key={item.school} className="flex items-start p-2 rounded-lg">
                            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-stone-200 mr-3">
                                <Image
                                    src={item.logo}
                                    alt={item.school}
                                    width={50}
                                    height={50}
                                    className="object-contain p-1" />
                            </div>
                            <div className="w-full">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-medium">
                                        {item.school}
                                    </h4>
                                    <p className="text-sm text-stone-400">
                                        {item.dates}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base text-stone-300">
                                        {item.degree}
                                    </h4>
                                    <p className="text-sm text-stone-400">
                                        {item.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </CardContent>
        </Card >
    );
}
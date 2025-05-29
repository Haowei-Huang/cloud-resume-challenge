"use client";
import { getPersonalData, getAboutMe } from "@/lib/data";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { SocialLinks } from "./social-links";

export function Profile() {
    const personalData = getPersonalData();
    const aboutMe = getAboutMe();

    return (
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm text-white flex flex-col">
            <CardContent className="p-0 flex flex-col items-center">
                {/* name, title, location, links*/}
                <div className="flex flex-col items-center w-full
                border-b border-stone-800">
                    {/* name, title, location */}
                    <div className="text-center">
                        <h2 className="font-bold text-2xl">
                            {personalData.name}
                        </h2>
                        <p className="text-base text-cyan-400">
                            {personalData.title}
                        </p>
                        <div className="flex items-center justify-center text-base text-stone-300 mb-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{personalData.location}</span>
                        </div>
                    </div>
                    {/* links */}
                    <SocialLinks socialLinks={personalData.socials} />
                </div>

                {/* about me*/}
                <div className="bg-transparent px-6 py-3 w-full">
                    {/* about me */}
                    <h3 className=" text-stone-300 flex items-center my-2 ">
                        <User className="w-4 h-4 mr-2 text-cyan-400" />
                        About Me
                    </h3>
                    <p className="text-base">
                        {aboutMe}</p>
                </div>
                {false && (<>{/* Email */}
                    <div className="bg-transparent px-6 py-3 w-full">
                        <div className="flex items-start">
                            <Mail className="w-5 h-5 mr-2 text-cyan-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-white">
                                    Email
                                </h3>
                                <a href={`mailto:${personalData.email}`} className="text-stone-400 hover:text-cyan-400 transition-colors duration-300">
                                    {personalData.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Phone */}
                    <div className="bg-transparent px-6 py-3 w-full">
                        <div className="flex items-start">
                            <Phone className="w-5 h-5 mr-2 text-cyan-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-white">
                                    Phone
                                </h3>
                                <a href={`tel:${personalData.email}`} className="text-stone-400 hover:text-cyan-400 transition-colors duration-300">
                                    {personalData.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Location */}
                    <div className="bg-transparent px-6 py-3 w-full">
                        <div className="flex items-start">
                            <MapPin className="w-5 h-5 mr-2 text-cyan-400 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-white">
                                    Location
                                </h3>
                                <p className="text-stone-400">
                                    {personalData.location}
                                </p>
                            </div>
                        </div>
                    </div>
                </>)}
            </CardContent>
        </Card>
    )
}
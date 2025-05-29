"use client";
import * as LucideIcons from "lucide-react";

interface SocialLink {
    name: string;
    url: string;
    icon: string;
}

interface SocialLinksProps {
    socialLinks: SocialLink[];
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {

    return (
        <div className="flex items-center justify-center gap-3 mb-6">
            {socialLinks.map((item) => {
                const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
                return (
                    <a key={item.name} href={item.url} aria-label={item.name}
                        className="bg-stone-800 rounded-full w-8 h-8
                    flex items-center justify-center 
                    hover:bg-stone-700 transition-colors duration-300">
                        {IconComponent && <IconComponent size={16} />}
                    </a>
                )
            }
            )
            }
        </div>
    )
}
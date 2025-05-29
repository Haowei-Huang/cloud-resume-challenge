"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { getNavItems, getPersonalData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function PortfolioHeader() {
    const navItems = getNavItems();
    const personalInfo = getPersonalData();
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false);

    // handle scroll to update section state
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // find the current section based on scroll position
            const sections = navItems.filter(item => item.href.startsWith("#")).map(item => item.href.substring(1));

            // use the last section that is in view and it's position to the top of the viewport is smaller than 150px
            for (const section of sections.reverse()) {
                // get the position of the section
                const element = document.getElementById(section);
                if (element) {
                    // get the position of the section
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        // if the section is at or above 150 px from the top of the view point
                        setActiveSection(section);
                        break;
                    }

                }
            }

            // if scroll to top, set active section to empty string
            if (window.scrollY === 0) {
                setActiveSection("");
            }
        }

        // Add scroll event listener to the window
        window.addEventListener("scroll", handleScroll);
        return () => {
            // Cleanup the event listener on component unmount
            window.removeEventListener("scroll", handleScroll);
        }
    }, [navItems]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
            scrolled && !mobileMenuOpen ? "bg-stone-900/90 backdrop-blur-md shadow-lg py-2" : "bg-transparent") // only hide the background when scrolled and menu is closed
        }>
            <div className="container flex items-center justify-between mx-auto px-4">
                <Link href="/" className="flex items-center group">
                    <div className="text-xl font-bold 
                        text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 
                        transition-transform duration-300 group-hover:scale-105 overflow-hidden relative">
                        {personalInfo.name}
                        <span className="absolute left-0 bottom-0 h-0.5 w-0
                        bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </div>
                    <span className="text-stone-400 text-base ml-2 transition-all duration-300 group-hover:text-stone-300">
                        / {personalInfo.title}
                    </span>
                </Link>
                { /* Desktop navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                    {
                        navItems.map((item) => {
                            const isActive = item.href === "/" ? activeSection === "" : activeSection === item.href.substring(1);
                            return (
                                <Link key={item.name}
                                    href={item.href}
                                    className={
                                        cn(
                                            "px-3 py-2 text-base relative group transition-all duration-300 ",
                                            isActive ? "text-cyan-500" : "text-gray-400 hover:text-white"
                                        )
                                    }>
                                    <span className="relative z-10">
                                        {item.name}
                                    </span>

                                    {/* Hover effect - subtle background glow */}
                                    <span className="absolute inset-0 rounded-md bg-color-500/0 group-hover:bg-cyan-500/10 transition-all duration-300"></span>

                                    {/* Hover effect - bottom border - underline from the center */}
                                    <span className={cn("absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:w-4/5",
                                        isActive && "w-4/5"
                                    )}>
                                    </span>
                                </Link>
                            )
                        })
                    }
                </nav>

                { /* Mobile button */}
                <button className="md:hidden text-stone-400 hover:text-white transition-colors duration-300 "
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu">
                    <span>{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</span>
                </button>
            </div>
            { /* Mobile navigation */}
            <div className={cn("md:hidden fixed inset-0 pt-20 px-4 bg-stone-900/95 backdrop-blur-md z-40 transition-all duration-500",
                mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none", // push the menu off-screen when closed
            )}>
                <nav className="flex flex-col space-y-4">
                    {
                        navItems.map((item, index) => {
                            const isActive = item.href === "/" ? activeSection === "" : activeSection === item.href.substring(1);
                            return (
                                <Link key={item.name}
                                    href={item.href}
                                    className={
                                        cn(
                                            "px-3 py-4 text-lg border-b border-stone-800 relative group transition-all duration-300 ",
                                            isActive ? "text-cyan-500 border-cyan-400/30" : "text-stone-300 hover:text-white hover:pl-6"
                                        )
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{
                                        transitionDelay: `${index * 50}ms`, // stagger the transition for each item
                                        transform: mobileMenuOpen ? "translateX(0)" : "translateX(20px)",
                                        opacity: mobileMenuOpen ? 1 : 0,
                                    }}
                                >

                                    <span className="relative z-10">
                                        {item.name}
                                    </span>

                                    <span
                                        className={
                                            cn("absolute left-0 top-1/2 -translate-y-1/2 h-1/2 bg-gradient-to-b from-cyan-400/20 to-blue-500/20 transition-all duration-300",
                                                isActive && "w-1"
                                            )
                                        }>
                                    </span>
                                </Link>
                            )
                        })
                    }
                </nav>
            </div>
        </header>
    )
}
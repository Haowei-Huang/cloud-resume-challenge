"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

const VISITOR_COUNT_URL = process.env.NEXT_PUBLIC_VISITOR_COUNT_URL || "";

export function VisitorCount() {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const response = await fetch(VISITOR_COUNT_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    console.error("Failed to fetch visitor count");
                    return;
                }

                const data = await response.json();
                setVisitorCount(data.item_count);
            } catch (error) {
                console.error("Error fetching visitor count:", error);
            }
        }

        fetchVisitorCount();
    }, [])

    return (
        <Card className="bg-stone-900/70 border-stone-800 backdrop-blur-sm text-white flex flex-col">
            <CardContent className="p-0 flex flex-col items-center">
                <h2 className="font-bold text-xl">
                    Visitor Count
                </h2>
                <p className="font-bold text-xl text-cyan-500" data-testid="visitor-count">
                    # {visitorCount}
                </p>
                <p className="text-sm text-stone-400">
                    (updates every 6 hours)
                </p>
            </CardContent>
        </Card >
    )
}
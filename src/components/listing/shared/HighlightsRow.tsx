import { Badge } from "@/components/ui/badge";

interface HighlightsRowProps {
    highlights: string[];
}

export function HighlightsRow({ highlights }: HighlightsRowProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {highlights.map((highlight, index) => (
                <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-muted text-foreground"
                >
                    {highlight}
                </Badge>
            ))}
        </div>
    );
}

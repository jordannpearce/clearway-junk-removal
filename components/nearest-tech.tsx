import { MapPin, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { closestTechnicians, locationLabel } from "@/lib/location";
import type { SavedLocation } from "@/lib/types";

export function NearestTech({ location }: { location: SavedLocation | null }) {
  const matches = closestTechnicians(location, 3);

  return (
    <Card className="border-primary/15 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MapPin className="size-5 text-primary" />
          Closest technicians for {locationLabel(location)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map(({ tech, miles }) => (
          <div key={tech.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <div>
              <p className="flex items-center gap-2 font-medium">
                <UserRound className="size-4 text-primary" />
                {tech.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Based in {tech.homeCity}, {tech.county} County · about {miles} miles
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tech.specialties.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <LinkButton href={`/schedule?city=${encodeURIComponent(tech.homeCity)}`} size="sm">
              Book {tech.name.split(" ")[0]}
            </LinkButton>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          Dispatch still confirms the final assignment so a closer open window can win. You can change your city anytime.
        </p>
      </CardContent>
    </Card>
  );
}

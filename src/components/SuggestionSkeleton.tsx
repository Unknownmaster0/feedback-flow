import { Card, CardContent } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";

export default function SuggestionSkeleton() {
  return (
    <Card className="border border-border/50">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-6 w-6 ml-2" />
        </div>
      </CardContent>
    </Card>
  );
}

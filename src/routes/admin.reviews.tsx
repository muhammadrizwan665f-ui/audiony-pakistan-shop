import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Star, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const { products } = useAdmin();
  
  // Flatten reviews from all products
  const allReviews = products.flatMap(p => 
    p.reviews.map(r => ({ ...r, productName: p.name, productId: p.id }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Product Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage and reply to customer feedback.</p>
      </div>

      <div className="grid gap-4">
        {allReviews.map((r, i) => (
          <div key={`${r.id}-${i}`} className="premium-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`size-3.5 ${j < r.rating ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{r.productName}</span>
                </div>
                <h3 className="font-display font-bold">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.body}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.city} · {format(new Date(r.date), "MMM d, yyyy")}</p>
                {r.verified && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-green-600">
                    <CheckCircle className="size-2.5" /> Verified Purchase
                  </span>
                )}
              </div>
            </div>

            {r.adminReply && (
              <div className="mt-4 rounded-xl bg-secondary/30 p-3 text-sm italic">
                <span className="font-semibold not-italic">Audiony Store:</span> {r.adminReply}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                <MessageSquare className="mr-2 size-3.5" /> Reply
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive">
                <XCircle className="mr-2 size-3.5" /> Hide Review
              </Button>
            </div>
          </div>
        ))}

        {allReviews.length === 0 && (
          <div className="premium-card p-12 text-center text-muted-foreground">
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}

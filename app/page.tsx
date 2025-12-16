import { Suspense } from "react";
import TrendingPostsClient from "@/components/trending-posts-client";
import { PostSkeleton } from "@/components/post-skeletion";

export default function HomePage() {
  return (
    <div className="space-y-6">

      {/* Loading skeleton bilan o'rab olamiz */}
      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      }>
        <TrendingPostsClient />
      </Suspense>
    </div>
  );
}
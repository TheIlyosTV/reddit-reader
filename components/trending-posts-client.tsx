"use client";

import { useEffect, useState } from "react";
import { fetchPosts, RedditPost } from "@/lib/reddit-api";
import { PostCard } from "@/components/post-card";
import { PostSkeleton } from "@/components/post-skeletion";
import { 
  ALL_CATEGORIES, 
  CategoryType 
} from "@/lib/categories";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function TrendingPostsClient() {
  const [category, setCategory] = useState<CategoryType>("hot");
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [after, setAfter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  // Category bo'yicha endpoint ni topish
  const getEndpoint = (cat: CategoryType): string => {
    const found = ALL_CATEGORIES.find(c => c.value === cat);
    return found ? found.endpoint : "popular";
  };

  const loadPosts = async (reset = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint(category);
      const { posts: newPosts, after: newAfter } = await fetchPosts(
        endpoint,
        12,
        reset ? undefined : after
      );

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setAfter(newAfter ?? undefined);
      
      if (newPosts.length === 0 && reset) {
        setError(`No posts found for ${category}. Try another category.`);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts(true);
  }, []);

  // Category o'zgarganda
  useEffect(() => {
    if (posts.length > 0 || error) {
      loadPosts(true);
    }
  }, [category]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        after &&
        !loading
      ) {
        loadPosts(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [after, loading]);

  return (
    <div className="px-4 md:px-0">
      {/* Mobile kategoriya tanlovi */}
      <div className="mb-6">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="w-full flex items-center justify-between p-3 bg-gray-800 dark:bg-gray-900 text-white rounded-lg md:hidden"
        >
          <span className="font-medium">
            Category: {ALL_CATEGORIES.find(c => c.value === category)?.label}
          </span>
          {showCategories ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>

        {/* Mobile kategoriya ro'yxati */}
        {showCategories && (
          <div className="md:hidden mt-2 p-3 bg-gray-800 dark:bg-gray-900 rounded-lg grid grid-cols-2 gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setShowCategories(false);
                }}
                className={`p-2 rounded text-sm font-medium ${category === cat.value ? 'bg-primary text-white' : 'bg-gray-700 dark:bg-gray-800 text-gray-200 hover:bg-gray-600'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Desktop kategoriyalar */}
        <div className="hidden md:block space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Main Categories</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.filter(cat => 
                ["popular", "hot", "top", "new"].includes(cat.value)
              ).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${category === cat.value ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Subreddits</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.filter(cat => 
                !["popular", "hot", "top", "new"].includes(cat.value)
              ).map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${category === cat.value ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Xato xabari */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button 
            onClick={() => loadPosts(true)}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Postlar gridi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <PostCard key={`${post.id}-${i}`} post={post} index={i} />
          ))
        ) : !loading ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No posts available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Select a category or check your connection
            </p>
          </div>
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))
        )}
      </div>

      {/* Yuklanayotganda */}
      {loading && posts.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading more posts...</p>
        </div>
      )}

      {/* Mobile bottom nav uchun padding */}
      <div className="h-16 md:h-0"></div>
    </div>
  );
}
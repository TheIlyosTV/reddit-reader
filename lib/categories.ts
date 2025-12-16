// lib/categories.ts

// Asosiy category'lar
export const MAIN_CATEGORIES = [
  { value: "hot", label: "Hot", endpoint: "hot" },
  { value: "top", label: "Top", endpoint: "top" },
  { value: "new", label: "New", endpoint: "new" },
] as const;

// Subreddit'lar
export const SUBREDDITS = [
  { value: "programming", label: "Programming", endpoint: "r/programming" },
  { value: "javascript", label: "JavaScript", endpoint: "r/javascript" },
  { value: "reactjs", label: "React", endpoint: "r/reactjs" },
  { value: "webdev", label: "WebDev", endpoint: "r/webdev" },
  { value: "typescript", label: "TypeScript", endpoint: "r/typescript" },
  { value: "node", label: "Node.js", endpoint: "r/node" },
  { value: "nextjs", label: "Next.js", endpoint: "r/nextjs" },
  { value: "tailwindcss", label: "Tailwind", endpoint: "r/tailwindcss" },
] as const;

// Barcha category'lar
export const ALL_CATEGORIES = [...MAIN_CATEGORIES, ...SUBREDDITS] as const;

export type MainCategoryType = typeof MAIN_CATEGORIES[number]["value"];
export type SubredditType = typeof SUBREDDITS[number]["value"];
export type CategoryType = MainCategoryType | SubredditType;
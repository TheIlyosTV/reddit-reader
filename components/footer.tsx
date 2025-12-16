import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <span className="text-sm font-semibold">Reddit Reader</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <Link href="https://github.com/TheIlyosTV" className="text-sm text-muted-foreground hover:text-foreground">
            GitHub
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
      
      {/* Bottom navigation uchun bo'sh joy qo'shish */}
      <div className="h-16 md:h-0"></div>
    </footer>
  )
}
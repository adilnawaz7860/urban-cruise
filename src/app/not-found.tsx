import Link from "next/link";
import { MapPin, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <MapPin className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mt-6 text-5xl font-bold">404</h1>
      <p className="mt-3 text-xl font-semibold">Page Not Found</p>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Looks like this route doesn&apos;t exist. Let&apos;s get you back to planning your next adventure.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-muted"
        >
          Browse Packages
        </Link>
      </div>
    </div>
  );
}

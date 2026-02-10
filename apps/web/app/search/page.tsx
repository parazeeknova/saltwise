import { SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <SearchIcon className="size-6 text-primary" />
        <h1 className="font-heading text-2xl">Drug Search</h1>
      </div>
      <p className="mt-2 text-muted-foreground text-sm">
        Search for medicines by name, salt, or manufacturer.
      </p>
    </div>
  );
}

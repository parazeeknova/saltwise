import { db } from "@bitwork/db";
import { sql } from "drizzle-orm";

export async function DbStatus() {
  try {
    const result = await db.execute(sql`SELECT current_database()`);
    const dbName = result[0]?.current_database ?? "unknown";

    return (
      <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-1.5 font-medium text-green-700 text-sm ring-1 ring-green-600/20 ring-inset">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />✅
        Connected: {dbName}
      </div>
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return (
      <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 font-medium text-red-700 text-sm ring-1 ring-red-600/10 ring-inset">
        <span className="h-2 w-2 rounded-full bg-red-600" />❌ Connection Error
      </div>
    );
  }
}

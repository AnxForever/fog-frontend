import { loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadDashboardData();
  return Response.json(data, {
    headers: {
      "cache-control": "no-store",
    },
  });
}

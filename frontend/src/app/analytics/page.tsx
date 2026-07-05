"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { Card, Stat } from "@/components/ui/card";
import { executionApi } from "@/lib/execution-api-client";

export default function AnalyticsPage() {
  // These three backend endpoints exist and are real, callable routes, but
  // each one is an explicit hardcoded stub server-side (see
  // ResourceControllers.java / ReadModelController) -- no real aggregate
  // query against tasks/focus-sessions exists yet. Wired for real (removing
  // the frontend-side fake numbers), but the values you see are still
  // preview data until the backend computes them for real.
  const weekly = useQuery({ queryKey: ["analytics-weekly"], queryFn: async () => (await executionApi.get("/analytics/weekly")).data });
  const categories = useQuery({ queryKey: ["analytics-categories"], queryFn: async () => (await executionApi.get("/analytics/categories")).data });
  const deepWork = useQuery({ queryKey: ["analytics-deep-work"], queryFn: async () => (await executionApi.get("/analytics/deep-work")).data });

  const loading = weekly.isLoading || categories.isLoading || deepWork.isLoading;
  const days: number[] = weekly.data?.days ?? [];

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between"><div><p className="text-sm font-medium text-blue">Analytics</p><h1 className="text-3xl font-semibold">Execution trends</h1></div><BarChart3 className="text-blue" /></section>

      <Card className="border-amber/40 bg-[#FFFBEB] text-sm text-amber-800">
        Preview data — these endpoints exist but return fixed placeholder values server-side, not real aggregates computed from your tasks and focus sessions yet.
      </Card>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Weekly deep work" value={`${deepWork.data?.hours ?? 0}h`} detail="Preview data" />
            <Stat label="Completion rate" value="—" detail="Not yet computed" />
            <Stat label="Category split" value={`${Object.keys(categories.data ?? {}).filter(k => k !== "isPlaceholder").length}`} detail="Preview data" />
          </div>
          <Card>
            <div className="flex h-52 items-end gap-3">
              {days.map((height, index) => (
                <div key={index} className="w-full rounded-t-md bg-blue" style={{ height: `${height}%` }} />
              ))}
              {days.length === 0 && <p className="text-sm text-muted">No data.</p>}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { executionApi } from "@/lib/execution-api-client";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  // The backend's /search endpoint is a real, callable route, but it's an
  // explicit stub that always returns zero results regardless of query --
  // no search index exists yet. Wired for real (no more hardcoded frontend
  // counts) rather than pretending this works end to end.
  const { data, isFetching } = useQuery({
    queryKey: ["search", submitted],
    queryFn: async () => {
      const res = await executionApi.get("/search", { params: { q: submitted } });
      return res.data;
    },
    enabled: submitted.length > 0,
  });

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between"><div><p className="text-sm font-medium text-blue">Global search</p><h1 className="text-3xl font-semibold">Find assessment assets</h1></div><Search className="text-blue" /></section>
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(query); }} className="flex gap-2">
          <Input placeholder="Search questions, candidates, assessments, reports, departments, batches" value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>
      </Card>
      <Card className="border-amber/40 bg-[#FFFBEB] text-sm text-amber-800">
        No search index exists on the backend yet — this calls a real endpoint, but it always returns zero results right now. Building real search is a separate, larger feature, not a wiring fix.
      </Card>
      {submitted && (
        <Card>
          {isFetching ? <p className="text-sm text-muted">Searching…</p> : (
            <p className="text-sm text-muted">
              {Array.isArray(data?.results) && data.results.length > 0
                ? `${data.results.length} results for "${submitted}"`
                : `No results for "${submitted}" (expected — see note above).`}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

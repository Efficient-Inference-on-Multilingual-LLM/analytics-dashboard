import React from "react";
import type { ClusterDto } from "@/types/dto";

interface ClusterListProps {
  clusters: ClusterDto[];
  languageRegistry?: Map<string, string>;
}

const ClusterList = ({ clusters, languageRegistry }: ClusterListProps) => {
  if (clusters.length === 0) return null;
  const sorted = [...clusters].sort(
    (a, b) => b.languages.length - a.languages.length,
  );
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Language Clusters</h3>
        <span className="text-xs font-mono text-muted-foreground">
          {clusters.length} cluster{clusters.length !== 1 ? "s" : ""} found.
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {sorted.map((cluster, i) => (
          <div key={i} className="">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium">Cluster {cluster.id}</span>
              <span className="text-xs font-mono text-muted-foreground">
                {cluster.languages.length} language
                {cluster.languages.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="font-mono text-xs text-muted-foreground bg-muted/40 rounded px-2 py-1.5 leading-relaxed break-all">
              {cluster.languages
                .map((lang) => languageRegistry?.get(lang) || lang)
                .join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterList;

"use client";

import React from "react";
import { DecoderResponse } from "@/types/response";

interface Props {
  data: DecoderResponse;
}

const PerExampleGrid = ({ data }: Props) => {
  const cell: Record<string, { token: string; prob: number }> = {};
  data.cells.forEach((c) => {
    cell[`${c.layer}|${c.position}`] = { token: c.token, prob: c.prob };
  });

  return (
    <div className="overflow-auto">
      <table className="border-collapse text-[11px]">
        <thead>
          <tr>
            <th className="text-muted-foreground px-2 py-1 text-left font-medium">
              layer
            </th>
            {data.positions.map((p, i) => (
              <th
                key={p}
                className="text-muted-foreground px-2 py-1 text-center font-medium"
              >
                {data.input_tokens[i]?.trim() || p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.layers.map((L) => (
            <tr key={L}>
              <th className="text-muted-foreground px-2 py-1 text-right font-medium">
                {L}
              </th>
              {data.positions.map((p) => {
                const c = cell[`${L}|${p}`];
                const a = c ? Math.max(0.04, Math.min(1, c.prob)) : 0;
                return (
                  <td
                    key={p}
                    className="px-2 py-1 text-center"
                    style={{
                      background: c ? `rgba(15,110,86,${a})` : "transparent",
                      color: a > 0.55 ? "#fff" : "inherit",
                    }}
                  >
                    {c?.token?.trim() ?? ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerExampleGrid;

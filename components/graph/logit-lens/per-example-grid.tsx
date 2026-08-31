"use client";

import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DecoderResponse } from "@/types/response";

interface Props {
  data: DecoderResponse;
}

type CellData = {
  tokens: string[];
  probs: number[];
  mass_covered: number;
  input_token_str: string;
};

type Active = {
  layer: number;
  hook: string;
  position: number;
  cell: CellData;
} | null;

const BRAND = "#0f6e56";
const HOOK_ORDER = ["resid_mid", "resid_post"];
const hookRank = (h: string) => {
  const i = HOOK_ORDER.indexOf(h);
  return i === -1 ? HOOK_ORDER.length : i;
};
const shortHook = (h: string) => h.replace(/^resid_/, "");

const PerExampleGrid = ({ data }: Props) => {
  const [active, setActive] = useState<Active>(null);

  const cell: Record<string, CellData> = useMemo(() => {
    const m: Record<string, CellData> = {};
    data.cells.forEach((c) => {
      m[`${c.layer}|${c.hook}|${c.position}`] = {
        tokens: c.token ?? [],
        probs: c.prob ?? [],
        mass_covered:
          c.mass_covered ?? (c.prob ?? []).reduce((s, p) => s + p, 0),
        input_token_str: c.input_token_str,
      };
    });
    return m;
  }, [data]);

  const hooks = useMemo(() => {
    const hookValues = [
      ...new Set(data.cells.map((c) => c.hook).filter(Boolean)),
    ];
    return hookValues.length
      ? hookValues.sort((a, b) => hookRank(a) - hookRank(b))
      : ["resid_post"];
  }, [data.cells]);
  const multiHook = hooks.length > 1;

  const rows = useMemo(
    () =>
      data.layers.flatMap((L) =>
        hooks.map((h, hi) => ({ layer: L, hook: h, firstOfLayer: hi === 0 })),
      ),
    [data.layers, hooks],
  );

  return (
    <>
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
            {rows.map(({ layer: L, hook: h, firstOfLayer }) => (
              <tr
                key={`${L}|${h}`}
                className={
                  multiHook && firstOfLayer ? "border-t border-black/10" : ""
                }
              >
                <th className="text-muted-foreground whitespace-nowrap px-2 py-1 text-right font-medium">
                  {L}
                  {multiHook && (
                    <span className="ml-1 text-[9px] opacity-60">
                      {shortHook(h)}
                    </span>
                  )}
                </th>
                {data.positions.map((p) => {
                  const c = cell[`${L}|${h}|${p}`];
                  const top = c?.tokens[0] ?? "";
                  const topProb = c?.probs[0] ?? 0;
                  const a = c ? Math.max(0.04, Math.min(1, topProb)) : 0;
                  return (
                    <td
                      key={p}
                      onClick={
                        c
                          ? () =>
                              setActive({
                                layer: L,
                                hook: h,
                                position: p,
                                cell: c,
                              })
                          : undefined
                      }
                      title={
                        c
                          ? `mass ${c.mass_covered.toFixed(3)} · ${c.tokens.length} tokens`
                          : undefined
                      }
                      className={`px-2 py-1 text-center ${c ? "cursor-pointer" : ""}`}
                      style={{
                        background: c ? `rgba(15,110,86,${a})` : "transparent",
                        color: a > 0.55 ? "#fff" : "inherit",
                      }}
                    >
                      {top.trim()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-sm">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm font-medium">
                  Layer {active.layer}
                  {multiHook ? ` · ${shortHook(active.hook)}` : ""} · position{" "}
                  {active.position}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  input token:{" "}
                  <span className="font-mono">
                    {active.cell.input_token_str.trim() || "∅"}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <ul className="flex max-h-72 flex-col gap-0.5 overflow-auto">
                {active.cell.tokens.map((t, i) => {
                  const pr = active.cell.probs[i] ?? 0;
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-2 px-1 text-[11px]"
                    >
                      <span
                        className="w-20 shrink-0 truncate font-mono"
                        title={t}
                      >
                        {t.trim() || "∅"}
                      </span>
                      <span className="relative h-3 flex-1 overflow-hidden rounded bg-black/5">
                        <span
                          className="absolute inset-y-0 left-0"
                          style={{
                            width: `${Math.min(100, pr * 100)}%`,
                            background: BRAND,
                          }}
                        />
                      </span>
                      <span className="text-muted-foreground w-10 shrink-0 text-right tabular-nums text-[10px]">
                        {pr.toFixed(3)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="text-muted-foreground flex justify-between border-t px-1 pt-2 text-[10px]">
                <span>{active.cell.tokens.length} tokens</span>
                <span>mass {active.cell.mass_covered.toFixed(3)}</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerExampleGrid;

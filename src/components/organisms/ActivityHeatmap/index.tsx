import { useMemo } from "react";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const levelColors = [
  "bg-muted/40",
  "bg-emerald-900/60",
  "bg-emerald-700/70",
  "bg-emerald-500/80",
  "bg-emerald-400",
];

function generateActivityData(): Record<string, number> {
  const data: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const rand = Math.random();
    if (rand > 0.7) {
      data[key] = rand > 0.95 ? 4 : rand > 0.85 ? 3 : rand > 0.75 ? 2 : 1;
    }
  }
  return data;
}

export function ActivityHeatmap() {
  const activityData = useMemo(() => generateActivityData(), []);

  // Build a grid of 53 columns x 7 rows (weeks x days)
  const { grid, monthHeaders, totalActivities } = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDay(); // 0=Sun
    // End of current week (Saturday)
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - todayDay));
    // Start 52 weeks before that Sunday
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 52 * 7 + 1);
    // Align start to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks: { date: string; level: number }[][] = [];
    const mHeaders: { label: string; col: number }[] = [];
    let lastMonth = -1;
    let total = 0;

    const cur = new Date(startDate);
    let weekIdx = 0;

    while (cur <= endDate) {
      const week: { date: string; level: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
        const level = cur <= today ? (activityData[key] || 0) : -1;
        if (level > 0) total += level;
        week.push({ date: key, level });

        // Track month changes on first day of week
        if (d === 0) {
          const m = cur.getMonth();
          if (m !== lastMonth) {
            mHeaders.push({ label: MONTHS[m], col: weekIdx });
            lastMonth = m;
          }
        }
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
      weekIdx++;
    }

    return { grid: weeks, monthHeaders: mHeaders, totalActivities: total };
  }, [activityData]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Atividades no Ano</h3>
        <span className="text-xs text-muted-foreground">{totalActivities} treinos</span>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
        <div style={{ width: `${grid.length * 13 + 28}px` }}>
          {/* Month labels */}
          <div className="flex h-4 mb-1" style={{ paddingLeft: 28 }}>
            {monthHeaders.map((mh, i) => {
              const nextCol = i < monthHeaders.length - 1 ? monthHeaders[i + 1].col : grid.length;
              const span = nextCol - mh.col;
              return (
                <div
                  key={i}
                  className="text-[10px] text-muted-foreground"
                  style={{ width: `${span * 13}px`, flexShrink: 0 }}
                >
                  {mh.label}
                </div>
              );
            })}
          </div>

          {/* Grid: 7 rows */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-[4px]" style={{ width: 24 }}>
              {DAYS.map((label, i) => (
                <div key={i} className="h-[11px] flex items-center">
                  <span className="text-[9px] text-muted-foreground leading-none">{label}</span>
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex gap-[2px]">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={cn(
                        "h-[11px] w-[11px] rounded-[2px]",
                        day.level === -1 ? "bg-transparent" : levelColors[day.level]
                      )}
                      title={
                        day.level >= 0
                          ? `${day.date}: ${day.level > 0 ? day.level + " treino(s)" : "Sem atividade"}`
                          : undefined
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-[9px] text-muted-foreground mr-1">Menos</span>
            {levelColors.map((color, i) => (
              <div key={i} className={cn("h-[10px] w-[10px] rounded-[2px]", color)} />
            ))}
            <span className="text-[9px] text-muted-foreground ml-1">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
}

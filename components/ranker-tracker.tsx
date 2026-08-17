import type { ActivityRow } from '@/lib/roster-data'

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-3 py-2 text-center">
      <p className="text-[9px] uppercase tracking-wider text-gold-muted">{label}</p>
      <p className="mt-0.5 font-serif text-sm text-ivory">{value || '—'}</p>
    </div>
  )
}

export function RankerTracker({ activity }: { activity: ActivityRow }) {
  const dates = Object.keys(activity.attendance)

  return (
    <div className="mt-3 rounded-lg border border-gold/30 bg-card/60 p-4">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider-2 text-gold">
        Ranker Tracker — {activity.company}
      </p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <StatBox label="Points" value={activity.points} />
        <StatBox label="Kills" value={activity.kills} />
        <StatBox label="KPE" value={activity.kpe} />
        <StatBox label="KDR" value={activity.kdr} />
        <StatBox label="Activity" value={activity.activity} />
        <StatBox label="Grade" value={activity.grade} />
      </div>

      <p className="mb-2 mt-4 text-[10px] uppercase tracking-wider text-gold-muted">
        Attendance ({activity.activityPct || '—'})
      </p>
      <div className="flex flex-wrap gap-1.5">
        {dates.map((date) => {
          const val = activity.attendance[date]
          const present = val === 'TRUE'
          const absent = val === 'FALSE'
          return (
            <div
              key={date}
              className={`flex flex-col items-center rounded-md border px-2 py-1.5 text-center ${
                present
                  ? 'border-gold/50 bg-gold/10'
                  : absent
                    ? 'border-border bg-background/40'
                    : 'border-border/40 bg-background/20'
              }`}
            >
              <span className="text-[9px] text-muted-foreground">{date}</span>
              <span
                className={`text-[10px] font-semibold ${
                  present ? 'text-gold' : absent ? 'text-muted-foreground' : 'text-muted-foreground/40'
                }`}
              >
                {present ? '✓' : absent ? '✗' : '—'}
              </span>
            </div>
          )
        })}
      </div>

      {activity.loa === 'TRUE' && (
        <p className="mt-3 text-center text-[11px] italic text-gold-muted">On LOA</p>
      )}
    </div>
  )
}

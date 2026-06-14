import { useEffect, useState } from 'react';
import { onTelemetryEvent } from '@/core/lib/telemetry';

// Dev-only telemetry overlay. Subscribes to the event tracker and shows the
// most recent events (name + props) so interaction telemetry is visible while
// iterating. Mounted only under import.meta.env.DEV — never ships. Sits to the
// right of the VitalsHud pill in the bottom-left corner.

const MAX = 6;

export default function EventsHud() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(
    () => onTelemetryEvent((e) => setEvents((prev) => [{ ...e, key: `${e.ts}-${e.name}` }, ...prev].slice(0, MAX))),
    [],
  );

  return (
    <div className="fixed bottom-3 left-14 z-[130] font-mono text-[11px] select-none">
      {open ? (
        <div className="rounded-xl border border-white/10 bg-slate-900/90 text-slate-200 backdrop-blur-xl shadow-2xl p-2.5 min-w-[180px] max-w-[260px]">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="uppercase tracking-[.12em] text-[9.5px] text-slate-400">Events</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close events" className="text-slate-400 hover:text-white">×</button>
          </div>
          {events.length === 0 ? (
            <div className="text-slate-500 py-1">no events yet…</div>
          ) : (
            <ul className="space-y-1">
              {events.map((e) => (
                <li key={e.key} className="flex items-center justify-between gap-3">
                  <span className="text-cyan-300 truncate">{e.name}</span>
                  <span className="text-slate-400 truncate max-w-[120px]">{Object.entries(e.props).map(([k, v]) => `${k}:${v}`).join(' ') || '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/10 bg-slate-900/85 text-slate-300 backdrop-blur px-2.5 py-1 shadow-lg hover:text-white"
          title="Analytics events"
        >
          📈{events.length ? ` ${events.length}` : ''}
        </button>
      )}
    </div>
  );
}

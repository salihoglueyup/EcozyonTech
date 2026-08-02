import { useEffect, useState } from 'react';
import { JOBS, mergeJobs } from '@/core/data/jobs';

async function fetchRemoteJobs() {
  if (typeof fetch === 'undefined') return [];
  try {
    const res = await fetch('/api/jobs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.ok && Array.isArray(data.jobs) ? data.jobs : [];
  } catch {
    return [];
  }
}

export function useAllJobs() {
  const [state, setState] = useState({ jobs: JOBS, loaded: false });
  useEffect(() => {
    let alive = true;
    fetchRemoteJobs().then((remote) => {
      if (!alive) return;
      setState({ jobs: remote.length ? mergeJobs(remote, JOBS) : JOBS, loaded: true });
    });
    return () => {
      alive = false;
    };
  }, []);
  return [state.jobs, state.loaded];
}

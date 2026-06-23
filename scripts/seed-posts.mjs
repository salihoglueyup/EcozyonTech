// One-time backfill: copy the static src/core/data/posts.js POSTS into the
// database as published posts. Idempotent (skips slugs that already exist).
// Run manually after provisioning the DB, like `npm run build:geo`:
//   DATABASE_URL=… node scripts/seed-posts.mjs
import { POSTS } from '../src/core/data/posts.js';
import { ensureSchema, create, getBySlug, validatePost, isConfigured } from '../api/_lib/posts-db.js';

if (!isConfigured()) {
  console.error('No DATABASE_URL is set — nothing to seed. Set it and re-run.');
  process.exit(1);
}

await ensureSchema();

let added = 0;
let skipped = 0;
for (const p of POSTS) {
  if (await getBySlug(p.slug)) {
    skipped++;
    continue;
  }
  const v = validatePost({ ...p, status: 'published' });
  if (!v.ok) {
    console.warn(`! skipped invalid post "${p.slug}":`, v.errors);
    continue;
  }
  await create(v.data);
  added++;
  console.log(`+ ${p.slug}`);
}

console.log(`\nSeed complete: ${added} added, ${skipped} already present.`);

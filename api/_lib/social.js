// Social publishing — fires when a post is published. A small provider
// abstraction so "others" (X, Bluesky…) can be added later; LinkedIn is the
// real one. Like forms.js deliver(), every provider degrades to a logged demo
// ack when its secrets are absent, so the CMS works end-to-end without them.
//
// LinkedIn auth model: a member access token + author URN supplied via env
// (LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN, e.g. "urn:li:person:abc123"),
// obtained once through LinkedIn's OAuth consent with the w_member_social scope.
// We post to the UGC Posts API server-side, so no browser CSP is involved.
import { SITE } from '../../src/core/config/site.js';

const LINKEDIN_UGC = 'https://api.linkedin.com/v2/ugcPosts';

export const linkedinConfigured = (env = process.env) =>
  Boolean(env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_AUTHOR_URN);

/** The public canonical URL of a post. */
export const postUrl = (post) => `${SITE.url}/blog/${post.slug}`;

/** Commentary text for a share: title + excerpt + link (English for reach). */
export function shareText(post) {
  const title = post.title?.en || post.title?.tr || '';
  const excerpt = post.excerpt?.en || post.excerpt?.tr || '';
  return [title, excerpt, postUrl(post)].filter(Boolean).join('\n\n');
}

/**
 * Publish a post to LinkedIn via the UGC Posts API. Demo fallback (no token):
 * logs + returns { posted:false, demo:true } so publishing never fails.
 */
export async function publishToLinkedIn(post, env = process.env, fetchImpl = fetch) {
  if (!linkedinConfigured(env)) {
    console.log('[social:linkedin] demo-mode (no LINKEDIN_ACCESS_TOKEN):', postUrl(post));
    return { provider: 'linkedin', posted: false, demo: true };
  }
  const body = {
    author: env.LINKEDIN_AUTHOR_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: shareText(post) },
        shareMediaCategory: 'ARTICLE',
        media: [{ status: 'READY', originalUrl: postUrl(post) }],
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };
  try {
    const res = await fetchImpl(LINKEDIN_UGC, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { provider: 'linkedin', posted: false, error: `http_${res.status}` };
    }
    return { provider: 'linkedin', posted: true };
  } catch (err) {
    return { provider: 'linkedin', posted: false, error: err?.message || 'network' };
  }
}

/**
 * Run every enabled provider for a freshly-published post and return their
 * results. Today: LinkedIn (X/Bluesky plug in here later; the public post page
 * already exposes share-intent links for those via shareLinks()).
 */
export async function publishPost(post, env = process.env, fetchImpl = fetch) {
  const results = [];
  results.push(await publishToLinkedIn(post, env, fetchImpl));
  return results;
}

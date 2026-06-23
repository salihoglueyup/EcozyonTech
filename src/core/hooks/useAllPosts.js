import { useEffect, useState } from 'react';
import { POSTS, mergePosts } from '@/core/data/posts';
import { fetchRemotePosts } from '@/core/lib/remotePosts';

/**
 * The full blog post list: static POSTS during prerender + first client render
 * (so the static-prerendered HTML matches and there is no hydration mismatch),
 * then merged with the DB-published posts fetched from /api/posts after mount.
 *
 * Returns `[posts, loaded]`. `loaded` flips true once the remote fetch settles,
 * letting detail/tag pages defer a "not found" decision until DB posts are in.
 */
export function useAllPosts() {
  const [state, setState] = useState({ posts: POSTS, loaded: false });
  useEffect(() => {
    let alive = true;
    fetchRemotePosts().then((remote) => {
      if (!alive) return;
      setState({ posts: remote.length ? mergePosts(remote, POSTS) : POSTS, loaded: true });
    });
    return () => {
      alive = false;
    };
  }, []);
  return [state.posts, state.loaded];
}

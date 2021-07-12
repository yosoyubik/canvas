import type { RouteDefinition } from 'svelte-spa-router';

import Canvas from './routes/Canvas.svelte';
import NotFound from './routes/NotFound.svelte';

export type Route = {
  name: string;
}
const routes: RouteDefinition = {
  // Exact path
  '/': Canvas,

  // Named parameters
  '/canvas/:name': Canvas,

  // Wildcard parameter
  // '/canvas/*': Canvas,

  // Catch-all
  // This is optional, but if present it must be the last
  '*': NotFound,
};

export default routes;

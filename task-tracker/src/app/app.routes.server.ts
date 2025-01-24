import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: (): Promise<Record<string, string>[]> => {
      return Promise.resolve([]);
    }
  }
];

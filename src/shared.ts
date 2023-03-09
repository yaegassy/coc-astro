import { LanguageClientOptions, workspace } from 'coc.nvim';

// Files we want to watch for file updates, this only includes files where we actually care
// about the content, so HTML components and Markdown files are not included
const supportedFileExtensions = [
  'astro',
  'cjs',
  'mjs',
  'js',
  'jsx',
  'cts',
  'mts',
  'ts',
  'tsx',
  'json',
  'vue',
  'svelte',
] as const;

export function getInitOptions(env: 'node' | 'browser', typescript: any): LanguageClientOptions {
  return {
    documentSelector: [{ scheme: 'file', language: 'astro' }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher(
        `{${supportedFileExtensions.map((ext) => `**/*.${ext}`).join(',')}}`,
        false,
        false,
        false
      ),
    },
    initializationOptions: {
      typescript,
      environment: env,
    },
  };
}

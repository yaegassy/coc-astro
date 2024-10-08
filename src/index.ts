import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  TransportKind,
  workspace,
  LanguageClientOptions,
} from 'coc.nvim';

type InitOptions = {
  typescript: {
    tsdk: string;
  };
} & Record<string, unknown>;

import * as fs from 'fs';
import * as path from 'path';

import * as tsVersion from './features/tsVersion';
import * as fileReferencesFeature from './features/fileReferences';
import * as reloadProjectFeature from './features/reloadProject';

let serverModule: string;

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('astro').get('enable')) return;

  const runtimeConfig = workspace.getConfiguration('astro.language-server');

  const serverPath = runtimeConfig.get<string>('ls-path');
  if (serverPath && fs.existsSync(serverPath)) {
    serverModule = serverPath;
  } else {
    serverModule = context.asAbsolutePath(
      path.join('node_modules', '@astrojs', 'language-server', 'bin', 'nodeServer.js'),
    );
  }

  const runOptions = { execArgv: [] };
  const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: runOptions,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  const serverRuntime = runtimeConfig.get<string>('runtime');
  if (serverRuntime) {
    serverOptions.run.runtime = serverRuntime;
    serverOptions.debug.runtime = serverRuntime;
  }

  const initializationOptions: InitOptions = {
    typescript: tsVersion.getCurrentTsPaths(context),
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'astro' }],
    initializationOptions,
    middleware: {
      resolveCompletionItem(item, token, next) {
        // REF: https://github.com/withastro/language-tools/issues/664
        if (workspace.getConfiguration('astro').get<boolean>('disableResolveCompletionItem')) {
          return item;
        }
        return next(item, token);
      },
    },
  };

  const client = new LanguageClient('astro', 'Astro', serverOptions, clientOptions);

  client.start();

  fileReferencesFeature.register('astro.findFileReferences', client);
  reloadProjectFeature.register('astro.reloadProject', context, client);
}

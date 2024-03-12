import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  TransportKind,
  workspace,
  LanguageClientOptions,
} from 'coc.nvim';

import { DiagnosticModel, InitializationOptions } from '@volar/language-server';

type InitOptions = InitializationOptions & {
  typescript: {
    tsdk: string;
  };
} & Record<string, unknown>;

import * as fs from 'fs';
import * as path from 'path';

import * as tsVersion from './features/tsVersion';
import * as autoInsertionFeature from './features/autoInsertion';
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
    // MEMO: I currently have it set to `DiagnosticModel.Pull`, because
    // it crashes after the language server starts if coc.nvim is not
    // very up-to-date.
    //
    // https://github.com/neoclide/coc.nvim/commit/dd4a5fa5a643bd78d808185c190b557343e82703
    ////diagnosticModel: DiagnosticModel.Push,
    diagnosticModel: DiagnosticModel.Pull,
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

  autoInsertionFeature.activate(['astro'], client);
  fileReferencesFeature.register('astro.findFileReferences', client);
  reloadProjectFeature.register('astro.reloadProject', context, client);
}

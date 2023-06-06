import {
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  TransportKind,
  workspace,
  LanguageClientOptions,
} from 'coc.nvim';

import { DiagnosticModel, InitializationOptions } from '@volar/language-server';

import * as fs from 'fs';
import * as path from 'path';

import * as tsVersion from './features/tsVersion';

let serverModule: string;

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('astro').get('enable')) return;

  const runtimeConfig = workspace.getConfiguration('astro.language-server');

  const serverPath = runtimeConfig.get<string>('ls-path');
  if (serverPath && fs.existsSync(serverPath)) {
    serverModule = serverPath;
  } else {
    serverModule = context.asAbsolutePath(
      path.join('node_modules', '@astrojs', 'language-server', 'bin', 'nodeServer.js')
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

  const initializationOptions: InitializationOptions = {
    typescript: tsVersion.getCurrentTsPaths(context),
    diagnosticModel: DiagnosticModel.Pull,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'astro' }],
    initializationOptions,
  };

  const client = new LanguageClient('astro', 'Astro', serverOptions, clientOptions);

  client.start();
}

import { ExtensionContext, LanguageClient, ServerOptions, TransportKind, workspace } from 'coc.nvim';

import * as path from 'path';

import * as fileReferencesFeature from './features/fileReferences';
import * as restartLanguageServerFeature from './features/restartLanguageServer';
import * as showTSXOutputFeature from './features/showTSXOutput';
import * as tagClosingFeature from './features/tagClosing';
import * as tsVersion from './features/tsVersion';
import { getInitOptions } from './shared';

export async function activate(context: ExtensionContext): Promise<void> {
  if (!workspace.getConfiguration('astro').get('enable')) return;

  const runtimeConfig = workspace.getConfiguration('astro.language-server');

  const serverModule = context.asAbsolutePath(
    // MEMO: 'node_modules/@astrojs/language-server/dist/server.js' will not start properly.
    //path.join('node_modules', '@astrojs', 'language-server', 'dist', 'server.js')
    path.join('node_modules', '@astrojs', 'language-server', 'bin', 'nodeServer.js')
  );

  const port = 6040;
  const debugOptions = { execArgv: ['--nolazy', '--inspect=' + port] };

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
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

  const typescript = tsVersion.getCurrentTsPaths(context);
  const clientOptions = getInitOptions('node', typescript);
  const client = new LanguageClient('astro', 'Astro', serverOptions, clientOptions);

  client.start();

  restartLanguageServerFeature.register(context, client);
  tagClosingFeature.register(context, client);
  showTSXOutputFeature.register(context, client);
  fileReferencesFeature.register(client);
}

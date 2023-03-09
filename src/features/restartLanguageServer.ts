import { commands, ExtensionContext, LanguageClient, workspace } from 'coc.nvim';

export function register(context: ExtensionContext, client: LanguageClient) {
  context.subscriptions.push(
    commands.registerCommand('astro.restartLanguageServer', async () => {
      // Refresh the diagnostics by setting undefined for coc.nvim
      const { document } = await workspace.getCurrentState();
      client.diagnostics?.set(document.uri, undefined);

      // Stop and Start
      await client.stop();
      client.start();
    })
  );
}

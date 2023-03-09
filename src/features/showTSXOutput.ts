import { commands, ExtensionContext, LanguageClient, window, workspace } from 'coc.nvim';

export async function register(context: ExtensionContext, client: LanguageClient) {
  context.subscriptions.push(commands.registerCommand('astro.showTSXOutput', showTSXOutput(client)));
}

function showTSXOutput(client: LanguageClient) {
  return async () => {
    const content = await client.sendRequest<string | undefined>(
      '$/getTSXOutput',
      window.activeTextEditor?.document.uri.toString()
    );

    if (content) {
      const bufferName = 'astro-show-tsx-output';

      await workspace.nvim
        .command(
          `belowright vnew ${bufferName} | setlocal buftype=nofile bufhidden=hide noswapfile filetype=typescriptreact`
        )
        .then(async () => {
          const buf = await workspace.nvim.buffer;
          buf.setLines(content.split('\n'), { start: 0, end: -1 });
        });
    } else {
      window.showErrorMessage("Could not open the current document's TSX output");
    }
  };
}

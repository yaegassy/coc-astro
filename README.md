# coc-astro

> fork from a [astro-vscode](https://github.com/withastro/language-tools/tree/main/packages/vscode)

Astro extension for [coc.nvim](https://github.com/neoclide/coc.nvim)

<img width="846" alt="coc-astro-demo" src="https://user-images.githubusercontent.com/188642/223913692-d44911ac-cf96-4d12-99c4-7d6a4baf34ca.png">

## Install

**CocInstall**:

```vim
:CocInstall @yaegassy/coc-astro
```

> scoped packages

**e.g. vim-plug**:

```vim
Plug 'yaegassy/coc-astro', {'do': 'yarn install --frozen-lockfile'}
```

## Note

### Filetype related

The "filetype" must be `astro` for this extension to work.

Install "astro" related plugin. (e.g. [vim-astro](https://github.com/wuelnerdotexe/vim-astro) or [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)).

## Configuration options

- `astro.enable`: Enable coc-astro extension, default: `true`
- `astro.useWorkspaceTsdk`: Use workspace (project) detected tsLibs in astro. if false, use coc-astro's built-in tsLibs, default: `false`
- `astro.tsLocale`: Sets the locale used to report diagnostics message from typescript, valid option: `["cs", "de", "es", "fr", "it", "ja", "ko", "en", "pl", "pt-br", "ru", "tr", "zh-cn", "zh-tw"]`, default: `"en"`
- `astro.autoClosingTags`: Enable/disable autoClosing of HTML tags, default: `true`

Other settings have the same configuration as [astro-vscode](https://github.com/withastro/language-tools/tree/main/packages/vscode). Check the configuration section of [package.json](./package.json).

## Commands

- `astro.restartLanguageServer`: Astro: Restart Language Server
- `astro.showTSXOutput`: Astro: Debug: Show TSX Output
- `astro.findFileReferences`: Astro: Find File References

## Thanks

- [withastro/language-tools](https://github.com/withastro/language-tools)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)

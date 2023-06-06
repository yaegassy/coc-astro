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

### How to set up TypeScript in your Astro project for coc.nvim

1. You need [coc-tsserver](https://github.com/neoclide/coc-tsserver). Please install it if you haven't already.

1. `coc-astro` has a setting to use `@astrojs/ts-plugin` in the extension as well as `astro-vscode`, so you can use typescript as it is.

## [RECOMMENDED] Additional installation of "watchman"

In the `@astrojs/language-server` used by `coc-astro`, it utilizes the `workspace/didChangeWatchedFiles` notification to watch files within the project.

In coc.nvim, it is recommended to install [watchman](https://facebook.github.io/watchman/) in order to utilize this feature.

- See: <https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions>

If you have difficulty installing `watchman`, you can use `coc-astro` without `watchman`, but you may not be able to immediately use IntelliSense with the newly added files.

In this case, please execute the command to restart the language server.

- `:CocRestart`

## Configuration options

- `astro.enable`: Enable coc-astro extension, default: `true`
- `astro.useWorkspaceTsdk`: Use workspace (project) detected tsLibs in astro. if false, use coc-astro's built-in tsLibs, default: `false`
- `astro.autoCreateQuotes`: Enable/disable auto creation of quotes for HTML attribute assignment, default: `true`
- `astro.autoClosingTags`: Enable/disable autoClosing of HTML tags, default: `true`

Other settings have the same configuration as [astro-vscode](https://github.com/withastro/language-tools/tree/main/packages/vscode). Check the configuration section of [package.json](./package.json).

## Commands

- `astro.findFileReferences`: Astro: Find File References
- `astro.reloadProject`: Astro: Reload Project

## Thanks

- [withastro/language-tools](https://github.com/withastro/language-tools)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)

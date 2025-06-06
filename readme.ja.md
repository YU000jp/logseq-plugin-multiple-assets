# Logseqプラグイン: *Multiple Files into Assets* 📂

通常、Logseqはアセットに単一のファイルしか保存できませんが、このプラグインは複数のファイルを処理します。

> [!WARNING]
>このプラグインはLogseq DBバージョンおよび`v0.10.11`、`v0.10.12`では動作しません。

<div align="right">

[English](https://github.com/YU000jp/logseq-plugin-multiple-assets) | [日本語](https://github.com/YU000jp/logseq-plugin-multiple-assets/blob/main/readme.ja.md) [![最新リリースバージョン](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-multiple-assets)](https://github.com/YU000jp/logseq-plugin-multiple-assets/releases)
[![ライセンス](https://img.shields.io/github/license/YU000jp/logseq-plugin-multiple-assets?color=blue)](https://github.com/YU000jp/logseq-plugin-multiple-assets/LICENSE)
[![ダウンロード数](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-multiple-assets/total.svg)](https://github.com/YU000jp/logseq-plugin-multiple-assets/releases)
 公開日 2023/06/27 <a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
</div>

## 概要

複数のファイルをアセットに保存し、コンテンツを埋め込むかリンクすることができます。

   ![画像](https://github.com/YU000jp/logseq-plugin-multiple-assets/assets/111847207/789a232e-7e37-4033-8048-6d33364eb70d)

### オプション

  - トリガー `📂 ローカルフォルダから複数のファイルを挿入`
    - アセットフォルダに保存せずに、コンテンツを埋め込むかリンクする。

---

## 始めに

⚠️ファイルは `assets/` フォルダではなく `assets/storages/logseq-plugin-multiple-assets/` フォルダに保存されます。

Logseq マーケットプレイスからインストール
  - 右上のツールバーで [`---`] をクリックして [`プラグイン`] を開きます。 `マーケットプレイス` を選択します。検索フィールドに `Assets` を入力し、検索結果から選択してインストールします。

    ![画像](https://github.com/YU000jp/logseq-plugin-multiple-assets/assets/111847207/5a3933c0-13f5-4c21-8fc8-c70429d7ad29)

### 使用方法

#### トリガー `💾 複数のアセットをアップロード`

1. ブロックのコンテキストメニューから（オプションを開くには、所望のプロパティを持つ箇条を右クリック）
1. スラッシュコマンド

#### プラグイン設定

- 同じ名前の既存ファイルを上書き: 選択
  - `スキップ` デフォルト
  - `上書き`
  - `タイムスタンプ`
- ファイル名にタイムスタンプを追加: 切り替え
  - `真`
  - `偽` デフォルト
- `📂 ローカルフォルダから複数のファイルを挿入` ブロックコンテキストメニューアイテムを有効にする
  - `真` デフォルト
  - `偽`

---

## ショーケース / 質問 / アイデア / ヘルプ

> [ディスカッション](https://github.com/YU000jp/logseq-plugin-multiple-assets/discussions) タブに移動して、この種の情報を質問し、探してみてください。

- 関連プラグイン
  1. [@xyhp915/ logseq-assets-plus plugin](https://github.com/xyhp915/logseq-assets-plus)
  1. [@b-yp/ logseq-link-to-local](https://github.com/b-yp/logseq-link-to-local/tree/dev)

## 先行技術とクレジット

- ライブラリ >  [@logseq/lib](https://github.com/logseq/logseq/pull/6488)
- Logseqプラグイン > [@hkgnp/ logseq-localassets-plugin](https://github.com/hkgnp/logseq-localassets-plugin)
- アイコン > [icooon-mono.com](https://icooon-mono.com/15427-%e3%83%95%e3%82%a9%e3%83%ab%e3%83%80%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b312/)
- 製作者 > [@YU000jp](https://github.com/YU000jp)

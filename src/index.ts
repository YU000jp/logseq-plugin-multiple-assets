import '@logseq/libs' //https://plugins-doc.logseq.com/
import { IAsyncStorage } from '@logseq/libs/dist/modules/LSPlugin.Storage'
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
let logseqVersion: string = "" //バージョンチェック用
let logseqDbGraph: boolean = false //グラフ種別チェック用


/* main */
const main = async () => {

  // グラフ種別チェック(ファイルアセットへ書き込むため、ファイルグラフのみ対応)

  const { version } = await fetchAppInfo()
  logseqVersion = version //情報用
  logseqDbGraph = await checkLogseqDbGraph() // DBグラフだった場合はtrue
  if (logseqDbGraph === true) {
    // DBグラフには対応していない(ファイルベースのグラフのみ対応)
    logseq.UI.showMsg("The 'Multiple Files into Assets' plugin does not support DB graphs. Please open a file-based graph.", "warning", { timeout: 5000 })
    return
  }

  await l10nSetup({ builtinTranslations: { ja } })
  /* user settings */
  logseq.useSettingsSchema(settingsTemplate())
  if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300)

  logseq.Editor.registerBlockContextMenuItem(
    t("💾 Upload multiple assets"),
    async ({ uuid }) => await embedHelper(uuid, true))

  logseq.Editor.registerSlashCommand(
    "💾 Upload multiple assets",
    async ({ uuid }) => await embedHelper(uuid, true))

  if (logseq.settings!.fromLocalBlockContext) logseq.Editor.registerBlockContextMenuItem(
    t("📂 Insert multiple files from local folder"),
    async ({ uuid }) => embedHelper(uuid, false))

  logseq.Editor.registerSlashCommand(
    "📂 Insert multiple files from local folder",
    async ({ uuid }) => embedHelper(uuid, false))

}/* end_main */


// アプリ情報取得(バージョン解析・情報用のみ。グラフ種別の判定には使わない)
const fetchAppInfo = async (): Promise<{ version: string; isDbEra: boolean }> => {
  const info = (await logseq.App.getInfo()) as { version?: string } | null
  const version = typeof info?.version === "string" ? info.version : "0.0.0"
  const m = version.match(/(\d+)\.(\d+)\.(\d+)/)
  const isDbEra = m ? (Number(m[1]) >= 2 || (Number(m[1]) === 0 && Number(m[2]) >= 11)) : false
  return { version: m ? m[0] : version, isDbEra }
}

// 現在のグラフがDBグラフかどうかのチェック(公式API。0.10.xホストでは未実装 → false)
const checkLogseqDbGraph = async (): Promise<boolean> => {
  try {
    const value = await (logseq.App as any).checkCurrentIsDbGraph()
    return typeof value === "boolean" ? value : false
  } catch {
    return false // API非搭載ホスト = DBグラフを開けない旧アプリ
  }
}

interface Files {
  name: string
  type: string
  path?: string
}


async function embedHelper(
  uuid: string,
  isAsset: boolean
): Promise<void> {
  const fileInput: HTMLInputElement = document.createElement("input")
  const btn: HTMLButtonElement = document.createElement("button")

  fileInput.type = "file"
  fileInput.multiple = true
  const storage = logseq.Assets.makeSandboxStorage() as IAsyncStorage
  fileInput.onchange = async (): Promise<void> => {
    fileInput.remove()
    btn.remove()
    try {
      const files = fileInput.files as FileList | null
      if (files === null) return
      for (const file of Array.from(files)) {
        const { type, path, name } = file as Files
        if (!type || !path || !name) {
          logseq.UI.showMsg(`Error writing file`, 'error')
          continue
        }

        let rename: string
        let duplicate: Boolean = false
        if (logseq.settings!.timestamp === true) {
          //「yyyymmdd」のフォーマットにしたい
          rename = `${timestamp()}_` + name
        } else {
          ////ファイル重複チェック
          if (await storage.hasItem(name) as boolean) {
            if (logseq.settings!.overwrite === "timestamp") {
              //「yyyymmdd」のフォーマットにしたい
              rename = `${timestamp()}_` + name
            } else if (logseq.settings!.overwrite === "overwrite") {
              await storage.removeItem(name)
              rename = name
            } else {
              //skip
              rename = name
              logseq.UI.showMsg(`File skipped: ${name}`, 'warning'), { timeout: 1300 }
              duplicate = true
            }
          } else {
            rename = name
          }
        }
        if (isAsset && duplicate === false) {
          try {
            const fileReader = new FileReader()
            fileReader.onload = () => storage.setItem(rename, fileReader.result as string)
            fileReader.readAsArrayBuffer(file)
          } catch (error) {
            logseq.UI.showMsg(`Error writing file: ${rename}`, 'error')
            continue
          } finally {
            logseq.UI.showMsg(t("File saved to assets"), 'success', { timeout: 1300 })
          }
        }
        let isEmbed: boolean
        let icon: string
        if (type.startsWith("image")) {
          icon = "🖼"
          isEmbed = true
        } else if (type.startsWith("video")) {
          icon = "📹"
          isEmbed = true
        } else if (type.startsWith("audio")) {
          icon = "🎧"
          isEmbed = true
        } else if (type.startsWith("text/html")) {
          icon = "📄"
          isEmbed = false
        } else if (type.startsWith("text/plain")) {
          icon = "📄"
          isEmbed = false
        } else if (type.startsWith("application/pdf")) {
          icon = "📰"
          isEmbed = true
        } else {
          icon = "📑"
          isEmbed = false
        }
        setTimeout(() => logseq.Editor.insertBlock(uuid, returnFilePath(isAsset, icon, rename, name, path, isEmbed), { focus: true }), 30)
      }
    } finally {
      setTimeout(() => logseq.Editor.selectBlock(uuid), 300)
    }
  }

  btn.addEventListener("click", () => fileInput.click())
  btn.click()
}


const timestamp = () => new Date().toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "_")


function returnFilePath(
  isAsset: boolean,
  emoji: any,
  rename: string,
  name: string,
  path: string,
  isEmbed: boolean,
): string {
  return (
    isAsset
      ? isEmbed ?
        `![${emoji} ${name}](../assets/storages/${logseq.baseInfo.id}/${rename})`
        : `[${emoji} ${name}](../assets/storages/${logseq.baseInfo.id}/${rename})`
      : isEmbed ?
        `![${emoji} ${name}](file://${path})`
        : `[${emoji} ${name}](file://${path})`
  )
}


/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate = (): SettingSchemaDesc[] => [
  {//同じファイル名が見つかった場合に上書きするか、timestampを付けるかどうか
    key: "overwrite",
    type: "enum",
    title: t("Overwrite existing files with the same name"),
    description: "default: `skip`",
    enumChoices: ["skip", "overwrite", "timestamp"],
    default: "skip",
  },
  {//ファイル名にtimestampをつける
    key: "timestamp",
    type: "boolean",
    title: t("Add timestamp to file name"),
    description: "default: `false`",
    default: false,
  },
  {
    key: "fromLocalBlockContext",
    type: "boolean",
    title: t("Enable `📂Insert multiple files from local folder` block context menu item"),
    description: t("default: `true` (⚠️need to turn off this plugin or restart Logseq to take effect)"),
    default: true,
  }
]


logseq.ready(main).catch(console.error)
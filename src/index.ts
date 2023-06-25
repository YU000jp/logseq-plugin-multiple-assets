import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { IAsyncStorage } from '@logseq/libs/dist/modules/LSPlugin.Storage';
//import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user';
//import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
//import ja from "./translations/ja.json";


/* main */
const main = () => {
  // (async () => {
  //   try {
  //     await l10nSetup({ builtinTranslations: { ja } });
  //   } finally {
  /* user settings */
  //logseq.useSettingsSchema(settingsTemplate);
  //if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300);
  //   }
  // })();

  logseq.Editor.registerBlockContextMenuItem(
    "💾Insert multiple files into assets",
    async ({ uuid }) => await embedHelper(uuid, true));

  // logseq.Editor.registerBlockContextMenuItem(
  //   "💾Insert multiple files from local",
  //   async ({ uuid }) => embedHelper(uuid, false));
};/* end_main */


interface Files {
  name: string;
  type: string;
  path?: string;
}

async function returnFilePath(
  uuid: string,
  isAsset: boolean,
  emoji: any,
  name: string,
  path: string
) {
  await logseq.Editor.insertBlock(
    uuid,
    isAsset
      ? await asset(emoji, name, path)
      : `![${emoji} ${name}](file://${path})`
  )
  await logseq.Editor.exitEditingMode();
}

const asset = async (emoji: string, name: string, path: string): Promise<string> => {
  let print = "";
  await (logseq.Assets.makeSandboxStorage() as IAsyncStorage).setItem(name, path).then(() => {
    logseq.UI.showMsg("File saved to assets");
    print = `![${emoji} ${name}](../assets/storages/${logseq.baseInfo.id}/${name})`;
  });
  return print;
}

async function embedHelper(
  uuid: string,
  isAsset: boolean
): Promise<void> {
  const fileInput: HTMLInputElement = document.createElement("input");
  const btn: HTMLButtonElement = document.createElement("button");

  fileInput.type = "file";
  fileInput.multiple = true;
  const storage = logseq.Assets.makeSandboxStorage() as IAsyncStorage;

  fileInput.onchange = async (): Promise<void> => {
    const files = fileInput.files as FileList | null;
    if (files === null) return;
    for (const file of Array.from(files)) {
      const { type, path, name } = file as Files;
      try {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          storage.setItem(name, fileReader.result as string);
        };
        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        logseq.UI.showMsg(`Error writing file: ${name}`, 'error');
        continue;
      }
      if (path) {
        let icon = "📑";
        if (type.startsWith("image")) {
          icon = "🖼";
        } else if (type.startsWith("video")) {
          icon = "📹";
        } else if (type.startsWith("audio")) {
          icon = "🎧";
        } else if (type.startsWith("text")) {
          icon = "📄";
        } else if (type.startsWith("application/pdf")) {
          icon = "📰";
        }
        returnFilePath(uuid, isAsset, icon, name, path);
      }
    }
  };

  btn.addEventListener("click", () => fileInput.click());
  btn.click();
}


/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
//const settingsTemplate: SettingSchemaDesc[] = [

//];


logseq.ready(main).catch(console.error);
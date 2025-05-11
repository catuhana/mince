export const USER_AGENT_HEADER = {
  "User-Agent": "catuhana/mince (tuhana.cat+github@gmail.com)",
};

export const MODRINTH_API_URL = new URL("https://api.modrinth.com/v2");
export const MINECRAFT_VERSION_MANIFEST_URL = new URL(
  "https://launchermeta.mojang.com/mc/game/version_manifest.json"
);

export const LOADER_PRETTY_NAMES = /** @type {const} */ ([
  "Fabric",
  "Forge",
  "NeoForge",
  "Quilt",
  "LiteLoader",
  "Risugami's ModLoader",
  "Rift",
]);
export const LOADER_VALUE_NAMES = /** @type {const} */ ([
  "fabric",
  "forge",
  "neoforge",
  "quilt",
  "liteloader",
  "modloader",
  "rift",
]);

export const Loaders = /** @type {const} */ ({
  [LOADER_PRETTY_NAMES[0]]: LOADER_VALUE_NAMES[0],
  [LOADER_PRETTY_NAMES[1]]: LOADER_VALUE_NAMES[1],
  [LOADER_PRETTY_NAMES[2]]: LOADER_VALUE_NAMES[2],
  [LOADER_PRETTY_NAMES[3]]: LOADER_VALUE_NAMES[3],
  [LOADER_PRETTY_NAMES[4]]: LOADER_VALUE_NAMES[4],
  [LOADER_PRETTY_NAMES[5]]: LOADER_VALUE_NAMES[5],
  [LOADER_PRETTY_NAMES[6]]: LOADER_VALUE_NAMES[6],
});

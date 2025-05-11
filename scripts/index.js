import { loadMinecraftVersions } from "./minecraft-versions.js";
import { loadModLoaders } from "./mod-loaders.js";
import { loadModsHandler } from "./mods-handler.js";

document.addEventListener("DOMContentLoaded", async () => {
  Promise.all([loadMinecraftVersions(), loadModLoaders(), loadModsHandler()]);
});

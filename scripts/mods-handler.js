import {
  LOADER_VALUE_NAMES,
  MODRINTH_API_URL,
  USER_AGENT_HEADER,
} from "./constants.js";

export const loadModsHandler = async () => {
  /**
   * @type {HTMLButtonElement}
   */
  const pickFolderButton = document.querySelector("button.pick-folder");
  /**
   * @type {HTMLSpanElement}
   */
  const pickInfo = document.querySelector("span.pick-info");

  /**
   * @type {HTMLDivElement}
   */
  const modList = document.querySelector("div.mod-list");

  /**
   * @type {HTMLDivElement}
   */
  const mods = modList.querySelector("div.mods");

  pickFolderButton.onclick = async (event) => {
    event.preventDefault();

    try {
      const folderHandle = await window.showDirectoryPicker({
        id: "pickFolder",
        mode: "readwrite",
        startIn: "documents",
      });
      pickInfo.textContent = `selected folder: ${folderHandle.name}`;
      pickInfo.style.removeProperty("color");

      await checkMods(scanFilesInFolder(folderHandle), modList);

      mods.hidden = false;
    } catch (error) {
      pickInfo.style.setProperty("color", "#ff746c");

      if (error.name === "AbortError") {
        pickInfo.textContent = "folder selection was cancelled";
      } else if (error.name === "SecurityError") {
        pickInfo.textContent = "folder selection was blocked by the browser";
      }

      return null;
    }
  };
};

/**
 *
 * @param {ReturnType<typeof scanFilesInFolder>} generator
 * @param {HTMLDivElement} modList
 */
async function checkMods(generator, modList) {
  /**
   * @type {HTMLDivElement}
   */
  const modsList = modList.querySelector("div.mods");
  /**
   * @type {HTMLSpanElement}
   */
  const modListInfo = modList.querySelector("span.mod-list-info");

  const modFiles = await Array.fromAsync(generator);

  const modsInfo = await Promise.all(
    modFiles.map((file, index) => processMod(file, index))
  );
  modListInfo.textContent = `found ${modFiles.length} mods`;

  /**
   * @param {File} file
   * @param {number} index
   */
  async function processMod(file, index) {
    modListInfo.innerHTML = `processing file <span>${index + 1} of ${
      modFiles.length
    }</span>`;

    const fileName = file.name;
    const fileSha512 = await getSHA512(await file.arrayBuffer());

    const modItemDiv = document.createElement("div");
    const spacing = document.createElement("hr");

    modItemDiv.classList.add("mod-item");
    modItemDiv.innerHTML = `
      <div class="mod-item-header">
        <h3 class="mod-item-file-name">${fileName}</h3>
        <code class="mod-item-file-hash">${fileSha512}</code>
      </div>
      <div class="mod-item-info">
        <h4 class="mod-item-name">loading...</h4>
        <div class="mod-item-versions">
          <span class="mod-item-current-version">loading...</span>
          <span class="mod-item-available-version">loading...</span>
        </div>
        <button type="button">update</button>
      </div>
    `;

    spacing.classList.add("mod-item-spacing");

    modsList.appendChild(modItemDiv);
    modsList.appendChild(spacing);

    return [fileName, fileSha512];
  }
}

/**
 * @typedef {Object} UpdatesFromHashesOptions
 * @property {string[]} hashes
 * @property {LOADER_VALUE_NAMES[number]} loaders
 * @property {string[]} gameVersions
 */

/**
 * @param {UpdatesFromHashesOptions} options
 */
async function findModUpdatesFromSHA512(options) {
  try {
    const response = await fetch(
      `${new URL("version_files/update", MODRINTH_API_URL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...USER_AGENT_HEADER,
        },
        body: JSON.stringify({
          hashes: options.hashes,
          algorithm: "sha512",
          loaders: options.loaders,
          game_versions: options.gameVersions,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching mods from SHA512: ${response.status} ${response.statusText}`
      );
    }

    /**
     * @typedef {Object} ModUpdateData
     * @property {string} name
     * @property {string} version_number
     * @property {string | null} changelog
     * @property {object[]} dependencies
     * @property {string[]} game_versions
     * @property {"release" | "beta" | "alpha"} version_type
     * @property {LOADER_VALUE_NAMES[number][]} loaders
     * @property {boolean} featured
     * @property {"listed" | "archived" | "draft" | "unlisted" | "scheduled" | "unknown"} status
     * @property {"listed" | "archived" | "draft" | "unlisted"} requested_status
     * @property {string} id
     * @property {string} project_id
     * @property {string} author_id
     * @property {string} date_published
     * @property {number} downloads
     * @property {string | null} changelog_url
     * @property {object[]} files
     */

    /**
     * @type {ModUpdateData[]}
     */
    const data = await response.json();
  } catch (error) {
    throw new Error("Could not fetch mods from SHA512", {
      cause: error,
    });
  }
}

/**
 * @param {BufferSource} buffer
 */
async function getSHA512(buffer) {
  const hash = await crypto.subtle.digest("SHA-512", buffer);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * @param {FileSystemDirectoryHandle} handle
 */
async function* scanFilesInFolder(handle) {
  for await (const entry of handle.values()) {
    if (entry.kind === "file") {
      yield await entry.getFile();
    }
  }
}

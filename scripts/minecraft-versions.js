import { MINECRAFT_VERSION_MANIFEST_URL } from "./constants.js";

/**
 * @type {HTMLDivElement}
 */
const minecraftVersionElement = document.querySelector("div.minecraft-version");

/**
 * @type {HTMLButtonElement}
 */
const versionSelectButton = minecraftVersionElement.querySelector(
  "button.expand-versions-list"
);
/**
 * @type {HTMLSelectElement}
 */
const versionSelect = minecraftVersionElement.querySelector(
  "select#versions-list"
);

export const loadMinecraftVersions = async () => {
  versionSelectButton.addEventListener("click", (event) => {
    event.preventDefault();

    versionSelect.hidden = !versionSelect.hidden;
  });

  try {
    const versions = await minecraftVersions();

    const fragment = document.createDocumentFragment();
    for (const version of versions) {
      const option = document.createElement("option");

      option.value = version;
      option.textContent = version;

      fragment.appendChild(option);
    }
    versionSelect.appendChild(fragment);
  } catch (error) {
    throw error;
  }
  versionSelect.children[0].remove();
};

async function minecraftVersions() {
  try {
    const response = await fetch(MINECRAFT_VERSION_MANIFEST_URL);

    if (!response.ok) {
      throw new Error(
        `Error fetching Minecraft versions: ${response.status} ${response.statusText}`
      );
    }

    /**
     * @type {{versions: {id: string, type: string}[]}}
     */
    const data = await response.json();

    return data.versions.map((version) => version.id);
  } catch (error) {
    throw new Error("Couldn't fetch Minecraft versions", {
      cause: error,
    });
  }
}

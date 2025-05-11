import { Loaders } from "./constants.js";

/**
 * @type {HTMLDivElement}
 */
const modLoaderDiv = document.querySelector("div.mod-loader");

/**
 * @type {HTMLButtonElement}
 */
const expandModLoadersButton = modLoaderDiv.querySelector(
  "button.expand-mod-loader-list"
);

/**
 * @type {HTMLSelectElement}
 */
const modLoaderList = modLoaderDiv.querySelector("select#mod-loader-list");

export const loadModLoaders = async () => {
  expandModLoadersButton.addEventListener("click", (event) => {
    event.preventDefault();

    modLoaderList.hidden = !modLoaderList.hidden;
  });

  const fragment = document.createDocumentFragment();
  for (const [loaderPretty, loader] of Object.entries(Loaders)) {
    const option = document.createElement("option");

    option.value = loader;
    option.textContent = loaderPretty;

    fragment.appendChild(option);
  }
  modLoaderList.children[0].remove();
  modLoaderList.appendChild(fragment);
};

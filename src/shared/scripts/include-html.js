/**
 * Includes all fragments referenced through the `w3-include-html` attribute.
 *
 * @returns {Promise<void>} Resolves after all referenced fragments were inserted.
 */
async function includeHTML() {
  const includeTargets = Array.from(document.querySelectorAll("[w3-include-html]"));

  for (const element of includeTargets) {
    const file = element.getAttribute("w3-include-html");

    if (!file) {
      continue;
    }

    try {
      const response = await fetch(file);
      element.innerHTML = response.ok ? await response.text() : "Page not found.";
    } catch (error) {
      element.innerHTML = "Page not found.";
    }

    element.removeAttribute("w3-include-html");
  }
}

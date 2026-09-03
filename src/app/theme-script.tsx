const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("sigma-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {}
})();
`;

export function ThemeInitScript() {
  // Se ejecuta antes de pintar para evitar el flash del tema equivocado:
  // lee la preferencia guardada y la aplica antes de que el CSS pinte.
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />;
}

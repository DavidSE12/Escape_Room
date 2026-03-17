// app/lib/ExportHTMLTemplate.tsx
"use client";


export interface ExportTab {
  id: number;
  title: string;
  content: string;
}

/* ---------- helpers ---------- */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Just for readability of the output string */
function indent(lines: string, spaces = 2) {
  const pad = " ".repeat(spaces);
  return lines
    .split("\n")
    .map((l) => (l.trim().length ? pad + l : l))
    .join("\n");
}

/* ---------- main builder ---------- */
export function buildSingleFileHTML(tabs: ExportTab[]) {
  const safeTabs = tabs.length ? tabs : [{ id: 1, title: "Tab 1", content: "" }];

  // Centralized inline styles
  const pageStyle =
    "margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;background:#ffffff;color:#111111;";
  const containerStyle = "max-width:860px;margin:0 auto;";
  const h1Style = "margin:0 0 16px 0;font-size:20px;";
  const tabbarStyle = "display:flex;flex-wrap:wrap;gap:8px;align-items:center;";
  const buttonBase =
    "padding:8px 12px;border:1px solid #d0d0d0;margin-right:8px;border-radius:6px;cursor:pointer;";
  const buttonInactive = "background:#f7f7f7;color:#111111;";
  const buttonActive = "background:#111111;color:#ffffff;";
  const panelStyle =
    "padding:16px;border:1px solid #e2e2e2;border-radius:8px;margin-top:12px;white-space:pre-wrap;line-height:1.5;";

  // Render ALL buttons as INACTIVE first; JS will paint the active one
  const buttons = safeTabs
    .map(
      (t) =>
        `<button data-tab="${t.id}" onclick="showTab(${t.id})" style="${buttonBase}${buttonInactive}">${escapeHtml(
          t.title || `Tab ${t.id}`
        )}</button>`
    )
    .join("\n");

  const panels = safeTabs
    .map(
      (t, idx) =>
        `<div id="panel-${t.id}" style="display:${idx === 0 ? "block" : "none"};${panelStyle}">
${indent(escapeHtml(t.content || ""), 2)}
</div>`
    )
    .join("\n");

  const body = `
<div style="${containerStyle}">
  <h1 style="${h1Style}">Tabs</h1>
  <div id="tabbar" style="${tabbarStyle}">
${indent(buttons, 4)}
  </div>
${indent(panels, 2)}
</div>

<script>
(function(){
  var ACTIVE = { bg: "#111111", color: "#ffffff" };
  var INACTIVE = { bg: "#f7f7f7", color: "#111111" };
  var activeId = ${safeTabs[0].id};

  function setActiveButton(id){
    var tabbar = document.getElementById("tabbar");
    var btns = tabbar ? tabbar.querySelectorAll("button[data-tab]") : [];
    btns.forEach(function(b){
      var isActive = Number(b.getAttribute("data-tab")) === id;
      b.style.background = isActive ? ACTIVE.bg : INACTIVE.bg;
      b.style.color = isActive ? ACTIVE.color : INACTIVE.color;
    });
  }

  window.showTab = function(id){
    if (id === activeId) return;
    var prev = document.getElementById("panel-" + activeId);
    var next = document.getElementById("panel-" + id);
    if (prev) prev.style.display = "none";
    if (next) next.style.display = "block";
    activeId = id;
    setActiveButton(id);
  };

  // Paint initial active state AFTER the DOM exists
  setActiveButton(activeId);
})();
</script>`.trim();

  return (
    "<!Doctype html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '  <meta charset="utf-8">\n' +
    "  <title>Tabs Export</title>\n" +
    '  <meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    "</head>\n" +
    `<body style="${pageStyle}">\n` +
    indent(body, 2) +
    "\n</body>\n</html>"
  );
}
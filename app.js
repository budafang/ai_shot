function getIdeaPriority(category) {
  const priorities = {
    "學習與作業誤用": 1,
    "內容造假與錯誤資訊": 2,
    "隱私與資料外洩": 3,
    "深偽與冒名": 4,
    "版權與創作挪用": 5,
    "校園治理與社群風險": 6,
    "職場與專業判斷失誤": 7,
    "商業與消費誤導": 8,
    "情感與人際誤用": 9,
    "公共議題與高風險決策": 10
  };
  return priorities[category] ?? 999;
}

function getCaseSourcePriority(source) {
  if (source.includes("中央社")) return 1;
  if (source.includes("iThome")) return 2;
  if (source.includes("TechNews")) return 3;
  return 9;
}

function getCaseVideoType(item) {
  const categoryMap = {
    "司法": "法律案例解析型短片",
    "政府": "政策與服務失誤解析型短片",
    "招聘": "職場不公平情境短劇",
    "法律服務": "制度風險說明型短片",
    "商業誤導": "消費警示型短片",
    "選舉與詐騙": "新聞快剪或反詐騙警示短片",
    "詐騙": "反詐騙情境短劇",
    "消費": "客服災難或消費者申訴短劇",
    "產品發布": "科技新聞解析型短片",
    "圖像生成": "真假對比或爭議拆解型短片",
    "媒體": "媒體識讀與查證型短片",
    "商業決策": "企業決策失誤解析型短片",
    "政治與資訊": "資訊查核型短片",
    "研究工具": "AI 幻覺警示型短片",
    "版權": "創作與授權爭議短片",
    "未成年保護": "青少年風險與陪伴議題短片",
    "假訊息": "資訊戰與媒體素養短片",
    "資訊品質": "查證實測型短片",
    "資安": "資安警示與實驗型短片"
  };
  return categoryMap[item.category] ?? "案例解析型短片";
}

function sortIdeas(ideas) {
  return [...ideas].sort((a, b) => {
    const diff = getIdeaPriority(a.category) - getIdeaPriority(b.category);
    if (diff !== 0) return diff;
    return a.id - b.id;
  });
}

function sortCases(cases) {
  return [...cases].sort((a, b) => {
    const sourceDiff = getCaseSourcePriority(a.source) - getCaseSourcePriority(b.source);
    if (sourceDiff !== 0) return sourceDiff;
    return String(b.year).localeCompare(String(a.year), "zh-Hant");
  });
}

function renderIdeaPage() {
  const root = document.getElementById("ideaGrid");
  const filters = document.getElementById("ideaFilters");
  const count = document.getElementById("ideaCount");
  if (!root || !filters || !count || !window.siteData) return;

  const sortedIdeas = sortIdeas(window.siteData.ideas);
  const categories = ["全部", ...new Set(sortedIdeas.map((item) => item.category))];

  function drawFilters(active) {
    filters.innerHTML = categories.map((category) => `
      <button class="chip ${category === active ? "is-active" : ""}" type="button" data-category="${category}">
        ${category}
      </button>
    `).join("");
  }

  function drawIdeas(active) {
    const list = active === "全部"
      ? sortedIdeas
      : sortedIdeas.filter((item) => item.category === active);

    count.textContent = active === "全部"
      ? `目前顯示全部 ${list.length} 個靈感`
      : `目前顯示「${active}」共 ${list.length} 個靈感`;

    root.innerHTML = list.map((item) => `
      <article class="idea-card">
        <div class="idea-card__meta">
          <span>${item.category}</span>
          <span>#${item.id}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.shot}</p>
      </article>
    `).join("");
  }

  drawFilters("全部");
  drawIdeas("全部");

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    const active = button.dataset.category;
    drawFilters(active);
    drawIdeas(active);
  });
}

function renderCasesPage() {
  const root = document.getElementById("caseGrid");
  const filters = document.getElementById("caseFilters");
  const count = document.getElementById("caseCount");
  if (!root || !filters || !count || !window.siteData) return;

  const sortedCases = sortCases(window.siteData.cases);
  const categories = ["全部", ...new Set(sortedCases.map((item) => item.category))];

  function drawFilters(active) {
    filters.innerHTML = categories.map((category) => `
      <button class="chip ${category === active ? "is-active" : ""}" type="button" data-category="${category}">
        ${category}
      </button>
    `).join("");
  }

  function drawCases(active) {
    const list = active === "全部"
      ? sortedCases
      : sortedCases.filter((item) => item.category === active);

    count.textContent = active === "全部"
      ? `目前顯示全部 ${list.length} 個案例`
      : `目前顯示「${active}」共 ${list.length} 個案例`;

    root.innerHTML = list.map((item) => `
      <article class="case-card">
        <div class="case-card__meta">
          <span>${item.category}</span>
          <span>${item.year}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <p style="margin-top:10px;"><strong>來源：</strong>${item.source}</p>
        <p style="margin-top:10px;"><strong>適合拍成：</strong>${getCaseVideoType(item)}</p>
        <p style="margin-top:12px;">
          <a class="source-link" href="${item.url}" target="_blank" rel="noreferrer">查看來源與查證連結</a>
        </p>
      </article>
    `).join("");
  }

  drawFilters("全部");
  drawCases("全部");

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    const active = button.dataset.category;
    drawFilters(active);
    drawCases(active);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderIdeaPage();
  renderCasesPage();
});

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function money(n) {
  return "¥ " + n.toLocaleString("zh-CN");
}

function nowStr() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}  ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function renderDash() {
  $("#view-dash").innerHTML = `
    <div class="hero">
      <img src="img/hero-factory.jpg" alt="数字工厂" />
      <div class="copy">
        <h1>码农老赵工业互联网 · 经营指挥舱</h1>
        <p>服务 18 家工厂客户 · 86 台在管设备 · 实时看见订单、产线、能耗与质量</p>
      </div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="label">今日成交额</div><div class="val" id="kpiGmv">¥ 86,400</div><div class="delta">较昨日 +12.8%</div></div>
      <div class="kpi"><div class="label">在制工单</div><div class="val" id="kpiWo">48</div><div class="delta">准交率 96.4%</div></div>
      <div class="kpi"><div class="label">设备在线率</div><div class="val" id="kpiOnline">97.8%</div><div class="delta">掉线 2 台 · 工单已派</div></div>
      <div class="kpi"><div class="label">本月新增合同</div><div class="val">¥ 36.8 万</div><div class="delta down">回款周期 41 天</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><h3>近 12 个月 · 硬件 + 软件订货</h3><div id="chartSales" class="chart"></div></div>
      <div class="card"><h3>产品线收入结构</h3><div id="chartMix" class="chart"></div></div>
    </div>
    <div class="grid-3">
      <div class="card"><h3>全国交付热力</h3><div id="chartMap" class="chart"></div></div>
      <div class="card"><h3>OEE / 直通率</h3><div id="chartOee" class="chart"></div></div>
      <div class="card"><h3>实时事件流</h3><div id="feed" style="font-size:13px;line-height:1.9;color:#c5d7e8"></div></div>
    </div>
  `;
  const months = ["9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月","8月"];
  const hw = [16, 18, 21, 32, 14, 12, 22, 24, 28, 31, 34, 36];
  const sw = [3, 4, 5, 7, 5, 4, 6, 7, 8, 8, 9, 10];
  const sales = echarts.init($("#chartSales"));
  sales.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", valueFormatter: (v) => v + " 万" },
    legend: { data: ["硬件订货", "软件/订阅"], textStyle: { color: "#8aa0b8" } },
    grid: { left: 48, right: 16, top: 32, bottom: 24 },
    xAxis: { type: "category", data: months, axisLine: { lineStyle: { color: "#335" } }, axisLabel: { color: "#8aa0b8" } },
    yAxis: { type: "value", name: "万元", nameTextStyle: { color: "#8aa0b8" }, axisLabel: { color: "#8aa0b8" }, splitLine: { lineStyle: { color: "rgba(255,255,255,.06)" } } },
    series: [
      { name: "硬件订货", type: "bar", data: hw, itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#20f0ff"},{offset:1,color:"#1a4cff"}]) } },
      { name: "软件/订阅", type: "line", data: sw, smooth: true, lineStyle: { color: "#ffb020", width: 3 }, areaStyle: { color: "rgba(255,176,32,.15)" } }
    ]
  });
  echarts.init($("#chartMix")).setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "item" },
    series: [{
      type: "pie", radius: ["46%", "70%"],
      label: { color: "#cfefff" },
      data: [
        { value: 22, name: "边缘网关" },
        { value: 16, name: "PLC / IO" },
        { value: 14, name: "变频器" },
        { value: 12, name: "伺服 / HMI" },
        { value: 12, name: "机器视觉" },
        { value: 10, name: "传感器" },
        { value: 14, name: "软件订阅" }
      ]
    }]
  });
  echarts.init($("#chartMap")).setOption({
    backgroundColor: "transparent",
    tooltip: {},
    xAxis: { type: "category", data: ["长三角","珠三角","成渝","京津冀","中部"], axisLabel: { color: "#8aa0b8" }, axisLine: { lineStyle: { color: "#335" } } },
    yAxis: { show: false },
    grid: { left: 16, right: 16, top: 20, bottom: 24 },
    series: [{ type: "bar", data: [96, 88, 74, 61, 55], itemStyle: { color: "#20f0ff", borderRadius: [6,6,0,0] } }]
  });
  echarts.init($("#chartOee")).setOption({
    backgroundColor: "transparent",
    series: [{
      type: "gauge", min: 60, max: 100,
      progress: { show: true, width: 14 },
      axisLine: { lineStyle: { width: 14 } },
      pointer: { show: false },
      detail: { valueAnimation: true, fontSize: 28, color: "#20f0ff", offsetCenter: [0, "20%"] },
      title: { offsetCenter: [0, "60%"], color: "#8aa0b8" },
      data: [{ value: 89.4, name: "综合 OEE" }]
    }]
  });
  const events = [
    "宁波注塑 · 凌风 G7 变频器 3# 跟随 PLC 将转速降到 38Hz",
    "深圳 SMT · 矩力伺服过载 108%，已自动限流并派电气工单",
    "成都装配 · PLC-800 循环 0.8ms，IO-16 全点正常",
    "合肥锂电 · 震感 Pro 预警主轴 3# 频谱异常",
    "苏州仓 · 变频器 IGBT 低于安全库存，已生成采购申请",
    "南通仓储 · AGV H3 完成 26 次线边配送"
  ];
  const feed = $("#feed");
  feed.innerHTML = events.map((e, i) => `<div>${i === 0 ? "●" : "○"} ${e}</div>`).join("");
}

function wallTwinSvg() {
  return `
    <svg class="twin-svg" viewBox="0 0 920 500" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="wallGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="zoneFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#20f0ff" stop-opacity=".10"/>
          <stop offset="100%" stop-color="#1a4cff" stop-opacity=".03"/>
        </linearGradient>
      </defs>
      <rect x="18" y="16" width="884" height="468" rx="6" fill="rgba(4,12,24,.35)" stroke="rgba(32,240,255,.2)"/>
      <g fill="none" stroke="rgba(32,240,255,.08)" stroke-width="1">
        ${Array.from({ length: 9 }, (_, i) => `<line x1="40" y1="${60 + i * 44}" x2="880" y2="${60 + i * 44}"/>`).join("")}
      </g>
      <rect x="48" y="48" width="250" height="170" rx="4" fill="url(#zoneFill)" stroke="rgba(32,240,255,.35)"/>
      <rect x="335" y="48" width="250" height="170" rx="4" fill="url(#zoneFill)" stroke="rgba(32,240,255,.35)"/>
      <rect x="622" y="48" width="250" height="170" rx="4" fill="url(#zoneFill)" stroke="rgba(32,240,255,.35)"/>
      <rect x="48" y="268" width="394" height="176" rx="4" fill="url(#zoneFill)" stroke="rgba(32,240,255,.28)"/>
      <rect x="478" y="268" width="394" height="176" rx="4" fill="url(#zoneFill)" stroke="rgba(32,240,255,.28)"/>
      <text x="60" y="70" fill="#8aa0b8" font-size="12" letter-spacing="2">宁波 · 注塑单元</text>
      <text x="347" y="70" fill="#8aa0b8" font-size="12" letter-spacing="2">苏州 · 机加单元</text>
      <text x="634" y="70" fill="#8aa0b8" font-size="12" letter-spacing="2">检测 / AOI</text>
      <text x="60" y="290" fill="#8aa0b8" font-size="12" letter-spacing="2">仓储 · AGV</text>
      <text x="490" y="290" fill="#8aa0b8" font-size="12" letter-spacing="2">边缘中枢 · MES</text>
      <g filter="url(#wallGlow)">
        <circle cx="110" cy="140" r="16" fill="#041820" stroke="#20f0ff" stroke-width="2"/>
        <circle cx="210" cy="140" r="16" fill="#041820" stroke="#3dff9a" stroke-width="2"/>
        <circle cx="160" cy="175" r="12" fill="#041820" stroke="#20f0ff" stroke-width="1.5"/>
        <circle cx="410" cy="130" r="16" fill="#041820" stroke="#20f0ff" stroke-width="2"/>
        <circle cx="510" cy="155" r="16" fill="#041820" stroke="#ffb020" stroke-width="2"/>
        <circle cx="700" cy="130" r="16" fill="#041820" stroke="#20f0ff" stroke-width="2"/>
        <circle cx="800" cy="165" r="16" fill="#041820" stroke="#20f0ff" stroke-width="2"/>
        <circle cx="160" cy="360" r="16" fill="#041820" stroke="#20f0ff" stroke-width="2"/>
        <circle cx="300" cy="380" r="16" fill="#041820" stroke="#3dff9a" stroke-width="2"/>
        <circle cx="620" cy="355" r="22" fill="#041820" stroke="#20f0ff" stroke-width="2.4"/>
        <circle cx="760" cy="380" r="16" fill="#041820" stroke="#6b8cff" stroke-width="2"/>
      </g>
      <g fill="#cfefff" font-size="11" text-anchor="middle">
        <text x="110" y="144">PLC</text>
        <text x="210" y="144">VFD</text>
        <text x="160" y="179" font-size="9">IO</text>
        <text x="410" y="134">CNC</text>
        <text x="510" y="159">伺服</text>
        <text x="700" y="134">相机</text>
        <text x="800" y="169">HMI</text>
        <text x="160" y="364">AGV</text>
        <text x="300" y="384">WMS</text>
        <text x="620" y="360">网关</text>
        <text x="760" y="384">MES</text>
      </g>
      <path class="flow" d="M126 140 H194"/>
      <path class="flow" d="M210 156 C 210 230, 160 230, 160 344"/>
      <path class="flow amber" d="M426 130 H494"/>
      <path class="flow" d="M716 130 H784"/>
      <path class="flow" d="M226 140 C 320 140, 320 355, 598 355"/>
      <path class="flow" d="M526 155 C 560 155, 560 355, 598 355"/>
      <path class="flow" d="M642 355 H744"/>
      <path class="flow amber" d="M316 380 C 420 380, 500 380, 598 365"/>
      <circle r="3.2" class="pkt" fill="#20f0ff">
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M210 156 C 210 230, 160 230, 160 344"/>
      </circle>
      <circle r="3.2" fill="#ffb020">
        <animateMotion dur="4.1s" repeatCount="indefinite" path="M226 140 C 320 140, 320 355, 598 355"/>
      </circle>
      <circle r="3.2" fill="#3dff9a">
        <animateMotion dur="3.6s" repeatCount="indefinite" path="M316 380 C 420 380, 500 380, 598 365"/>
      </circle>
    </svg>
  `;
}

let wallLive = null;
let wallCharts = [];

function stopWallLive() {
  if (wallLive) {
    clearInterval(wallLive);
    wallLive = null;
  }
  wallCharts.forEach((c) => {
    try { c.dispose(); } catch (e) { /* ignore */ }
  });
  wallCharts = [];
}

function renderWall() {
  stopWallLive();
  const mixN = WALL_MIX.reduce((s, m) => s + m.n, 0);
  $("#view-wall").innerHTML = `
    <div class="wall">
      <div class="wall-scan"></div>
      <header class="wall-hd">
        <div class="wall-hd-side">
          <button class="wall-back" id="wallBack">返回系统</button>
          <span>IIoT OS · 苏州总部</span>
        </div>
        <h1>码农老赵 · 工业互联网中控中心</h1>
        <div class="wall-hd-side right"><span id="wallClock">${nowStr()}</span></div>
      </header>
      <div class="wall-kpis">
        <div class="wall-kpi"><div class="k">接入现场</div><div class="v">18 <span class="u">家</span></div></div>
        <div class="wall-kpi"><div class="k">在管设备</div><div class="v">${mixN} <span class="u">台</span></div></div>
        <div class="wall-kpi"><div class="k">在线率</div><div class="v" id="wallOnline">97.8<span class="u">%</span></div></div>
        <div class="wall-kpi"><div class="k">今日产量</div><div class="v" id="wallPcs">1,260 <span class="u">pcs</span></div></div>
        <div class="wall-kpi"><div class="k">今日产值</div><div class="v" id="wallGmv">¥ 8.64 <span class="u">万</span></div></div>
        <div class="wall-kpi"><div class="k">综合 OEE</div><div class="v">89.4<span class="u">%</span></div></div>
      </div>
      <div class="wall-body">
        <div class="wall-col">
          <div class="wall-panel">
            <h3>设备构成 · 86 台在管</h3>
            ${WALL_MIX.map((m) => `<div class="mix-row"><span>${m.name}</span><div class="mix-bar"><i style="width:${m.pct}%"></i></div><span class="n">${m.n}</span></div>`).join("")}
          </div>
          <div class="wall-panel">
            <h3>24 小时产量</h3>
            <div id="chartWallPcs" class="wall-chart"></div>
          </div>
        </div>
        <div class="wall-mid">
          <div class="wall-panel wall-twin">
            <h3>数字车间拓扑 · OPC UA / EtherCAT / 5G</h3>
            ${wallTwinSvg()}
          </div>
          <div class="wall-sites">
            ${WALL_SITES.map((s) => `
              <div class="wall-site">
                <div class="n"><i class="dot ${s.st}"></i>${s.name}</div>
                <div class="r">${s.role}</div>
                <div class="c">${s.n} 台接入</div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="wall-col">
          <div class="wall-panel">
            <h3>质量 · 稼动雷达</h3>
            <div id="chartWallRadar" class="wall-chart"></div>
          </div>
          <div class="wall-panel">
            <h3>实时告警</h3>
            <div class="wall-alarms" id="wallAlarms">
              ${WALL_ALARMS.map((a) => `<div class="row ${a[3]}"><span>${a[0]}</span><span>${a[1]}</span><span>${a[2]}</span></div>`).join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="wall-ticker">
        <div class="tag">LIVE</div>
        <div class="run">${WALL_TICKER.concat(WALL_TICKER).map((t) => `◆ ${t}`).join("　　")}</div>
      </div>
    </div>
  `;
  $("#wallBack").addEventListener("click", () => show("dash"));
  const hours = Array.from({ length: 12 }, (_, i) => `${String((i * 2)).padStart(2, "0")}:00`);
  const pcs = [42, 38, 28, 22, 48, 86, 92, 88, 76, 81, 74, 68];
  const c1 = echarts.init($("#chartWallPcs"));
  c1.setOption({
    backgroundColor: "transparent",
    grid: { left: 36, right: 10, top: 16, bottom: 22 },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: hours, axisLabel: { color: "#8aa0b8", fontSize: 10 }, axisLine: { lineStyle: { color: "#335" } } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,.06)" } }, axisLabel: { color: "#8aa0b8", fontSize: 10 } },
    series: [{
      type: "line", data: pcs, smooth: true, symbol: "none",
      lineStyle: { color: "#20f0ff", width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(32,240,255,.35)" }, { offset: 1, color: "rgba(32,240,255,0)" }]) }
    }]
  });
  const c2 = echarts.init($("#chartWallRadar"));
  c2.setOption({
    backgroundColor: "transparent",
    radar: {
      indicator: [
        { name: "稼动", max: 100 },
        { name: "直通", max: 100 },
        { name: "准交", max: 100 },
        { name: "能耗", max: 100 },
        { name: "安全", max: 100 }
      ],
      splitLine: { lineStyle: { color: "rgba(32,240,255,.2)" } },
      splitArea: { areaStyle: { color: ["rgba(32,240,255,.04)", "rgba(32,240,255,.01)"] } },
      axisName: { color: "#8aa0b8", fontSize: 11 },
      axisLine: { lineStyle: { color: "rgba(32,240,255,.25)" } }
    },
    series: [{
      type: "radar",
      data: [{ value: [89, 97, 96, 84, 99], name: "今日" }],
      lineStyle: { color: "#20f0ff" },
      areaStyle: { color: "rgba(32,240,255,.22)" },
      itemStyle: { color: "#20f0ff" }
    }]
  });
  wallCharts = [c1, c2];
  requestAnimationFrame(() => wallCharts.forEach((c) => c.resize()));
  wallLive = setInterval(() => {
    const online = (97.4 + Math.random() * 0.8).toFixed(1);
    const pcsNow = 1260 + Math.round(Math.random() * 18);
    const gmv = (8.42 + Math.random() * 0.46).toFixed(2);
    const elO = $("#wallOnline");
    const elP = $("#wallPcs");
    const elG = $("#wallGmv");
    if (!elO) return;
    elO.innerHTML = `${online}<span class="u">%</span>`;
    elP.innerHTML = `${pcsNow.toLocaleString("zh-CN")} <span class="u">pcs</span>`;
    elG.innerHTML = `¥ ${gmv} <span class="u">万</span>`;
  }, 1800);
}

function renderProducts() {
  const autoN = PRODUCTS.filter((p) => p.cat === "自动化设备").length;
  $("#view-products").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">在售 SKU</div><div class="val">${PRODUCTS.length}</div><div class="delta">工联网 ${PRODUCTS.length - autoN} · 自动化 ${autoN}</div></div>
      <div class="kpi"><div class="label">目录均价</div><div class="val">${money(Math.round(PRODUCTS.reduce((s,p)=>s+p.price,0)/PRODUCTS.length))}</div><div class="delta">含 PLC / 变频器 / 伺服</div></div>
      <div class="kpi"><div class="label">可售库存</div><div class="val">${PRODUCTS.reduce((s,p)=>s+p.stock,0).toLocaleString()}</div><div class="delta">4 仓协同</div></div>
      <div class="kpi"><div class="label">爆款</div><div class="val">G7 变频器</div><div class="delta">本周渠道加单 8 台</div></div>
    </div>
    <div class="filters" id="prodFilters">
      <button class="on" data-cat="全部">全部</button>
      <button data-cat="自动化设备">自动化设备</button>
      <button data-cat="工业互联网">工业互联网</button>
    </div>
    <div class="products" id="prodGrid"></div>
  `;
  const paint = (cat) => {
    const list = cat === "全部" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);
    $("#prodGrid").innerHTML = list.map((p) => `
      <article class="product">
        <img src="${p.img}" alt="${p.name}" />
        <div class="meta">
          <h4>${p.name}</h4>
          <div class="sku">SKU ${p.id} · ${p.cat}</div>
          <p>${p.desc}</p>
          <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <div class="price-row"><span class="price">${money(p.price)}</span><span class="stock">库存 ${p.stock}</span></div>
        </div>
      </article>
    `).join("");
  };
  paint("全部");
  $$("#prodFilters button").forEach((b) => b.addEventListener("click", () => {
    $$("#prodFilters button").forEach((x) => x.classList.toggle("on", x === b));
    paint(b.dataset.cat);
  }));
}

function renderOrders() {
  $("#view-orders").innerHTML = `
    <div class="card" style="min-height:auto">
      <h3>本周客户订单 · 自动化设备与工联网</h3>
      <table>
        <thead><tr><th>订单号</th><th>客户</th><th>标的</th><th>金额</th><th>状态</th></tr></thead>
        <tbody>
          ${ORDERS.map((o) => `<tr><td>${o[0]}</td><td>${o[1]}</td><td>${o[2]}</td><td>${money(o[3])}</td><td><span class="badge ${o[5]}">${o[4]}</span></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMes() {
  $("#view-mes").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">今日产出</div><div class="val">1,260 pcs</div><div class="delta">计划达成 104%</div></div>
      <div class="kpi"><div class="label">直通率 FPY</div><div class="val">97.2%</div><div class="delta">AOI 拦截 38 件</div></div>
      <div class="kpi"><div class="label">平均节拍</div><div class="val">12.6 s</div><div class="delta">较上周 -0.8s</div></div>
      <div class="kpi"><div class="label">安灯呼叫</div><div class="val">6</div><div class="delta down">物料 4 · 质量 2</div></div>
    </div>
    <div class="card"><h3>重点产线实时进度</h3>
      <div class="lines">
        ${LINES.map((l) => `
          <div class="line">
            <div class="row"><strong>${l.name}</strong><span>${l.plant} · OEE ${l.oee}%</span></div>
            <div class="bar"><i style="width:${l.progress}%"></i></div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderIot() {
  $("#view-iot").innerHTML = `
    <div class="card" style="min-height:auto">
      <h3>设备孪生 · 现场资产</h3>
      <div class="devices">
        ${DEVICES.map((d) => `
          <div class="device">
            <div>
              <strong>${d[0]}</strong>
              <div style="color:#8aa0b8;font-size:12px;margin-top:4px">${d[1]} · ${d[2]}</div>
            </div>
            <div style="text-align:right">
              <span class="badge ${d[4]}">${d[3]}</span>
              <div style="color:#c5d7e8;font-size:12px;margin-top:6px">${d[5]}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderStock() {
  $("#view-stock").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">存货总额</div><div class="val">¥ 46.4 万</div><div class="delta">较上月 +4.2%</div></div>
      <div class="kpi"><div class="label">SKU / 库位</div><div class="val">174</div><div class="delta">利用率 69%</div></div>
      <div class="kpi"><div class="label">今日出入库</div><div class="val">18 单</div><div class="delta">入 7 · 出 11</div></div>
      <div class="kpi"><div class="label">缺料预警</div><div class="val">6</div><div class="delta down">IGBT / PLC 主板</div></div>
    </div>
    <div class="whs">
      ${WAREHOUSES.map((w) => `
        <div class="kpi" style="min-height:140px">
          <div class="label">${w.name}</div>
          <div class="val">${w.sku} SKU</div>
          <div class="delta">存货 ${w.value} · 周转 ${w.turnover} · 库容 ${w.cap}</div>
        </div>
      `).join("")}
    </div>
    <div class="card flat">
      <h3>库存台账 · PLC / 变频器 / 伺服及关键料</h3>
      <table>
        <thead><tr><th>物料</th><th>名称</th><th>分类</th><th>库位</th><th>现存量</th><th>安全库存</th><th>锁定</th><th>状态</th></tr></thead>
        <tbody>
          ${STOCK_ITEMS.map((r) => `<tr>
            <td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td>
            <td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td>
            <td><span class="badge ${r[7]}">${r[7]==="ok"?"充足":r[7]==="warn"?"偏低":"缺料"}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="card flat">
      <h3>今日仓储作业单据</h3>
      <table>
        <thead><tr><th>单号</th><th>类型</th><th>往来</th><th>物料</th><th>仓</th><th>状态</th></tr></thead>
        <tbody>
          ${STOCK_DOCS.map((d) => `<tr>
            <td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${d[3]}</td><td>${d[4]}</td>
            <td><span class="badge ${d[6]}">${d[5]}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderHr() {
  $("#view-hr").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">在册人数</div><div class="val">62</div><div class="delta">本月入职 2 · 离职 0</div></div>
      <div class="kpi"><div class="label">今日出勤率</div><div class="val">93.5%</div><div class="delta">实到 58 人</div></div>
      <div class="kpi"><div class="label">年人均产值</div><div class="val">¥ 28.6 万</div><div class="delta">较去年 +11%</div></div>
      <div class="kpi"><div class="label">招聘进行中</div><div class="val">5</div><div class="delta">PLC 工程师 2 · 伺服 1</div></div>
    </div>
    <div class="kpis-6">
      ${HR_ATTEND.map((a) => `<div class="kpi"><div class="label">${a[0]}</div><div class="val">${a[1]}</div></div>`).join("")}
    </div>
    <div class="whs" style="grid-template-columns:repeat(3,1fr)">
      ${HR_DEPTS.map((d) => `
        <div class="kpi" style="min-height:120px">
          <div class="label">${d.city}</div>
          <div class="val" style="font-size:20px">${d.name}</div>
          <div class="delta">${d.people} 人 · 负责人 ${d.head}</div>
        </div>
      `).join("")}
    </div>
    <div class="card flat">
      <h3>关键岗位花名册 · 自动化与供应链</h3>
      <table>
        <thead><tr><th>工号</th><th>姓名</th><th>部门</th><th>岗位</th><th>职级</th><th>状态</th></tr></thead>
        <tbody>
          ${HR_STAFF.map((s) => `<tr>
            <td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td><td>${s[6]}</td>
            <td><span class="badge ${s[5]}">${s[4]}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEquip() {
  const origin = ASSETS.reduce((s, a) => s + a[6], 0);
  const using = ASSETS.filter((a) => a[4] === "在用").length;
  const maintN = MAINT_WO.filter((w) => w[3] !== "已完成").length;
  $("#view-equip").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">自有设备</div><div class="val">${ASSETS.length}</div><div class="delta">在用 ${using} · 客户在保 86 台</div></div>
      <div class="kpi"><div class="label">设备原值</div><div class="val">${money(origin)}</div><div class="delta">净值约 ¥ 31.8 万</div></div>
      <div class="kpi"><div class="label">本月维保</div><div class="val">${MAINT_WO.length}</div><div class="delta">未完成 ${maintN} 单 · 费用 ¥ 5,840</div></div>
      <div class="kpi"><div class="label">今日到期</div><div class="val">1</div><div class="delta down">空压机 GA11 换油滤</div></div>
    </div>
    <div class="filters" id="assetFilters">
      <button class="on" data-st="全部">全部</button>
      <button data-st="在用">在用</button>
      <button data-st="保养中">保养中</button>
      <button data-st="外借">外借</button>
      <button data-st="校准中">校准中</button>
    </div>
    <div class="card flat" style="margin-top:0">
      <h3>固定资产台账 · 车间 / 仓储 / 实验室</h3>
      <table>
        <thead><tr><th>资产编号</th><th>名称</th><th>类别</th><th>位置</th><th>原值</th><th>启用</th><th>责任人</th><th>下次保养</th><th>状态</th></tr></thead>
        <tbody id="assetBody"></tbody>
      </table>
    </div>
    <div class="card flat">
      <h3>维保工单</h3>
      <table>
        <thead><tr><th>单号</th><th>作业</th><th>地点</th><th>费用</th><th>执行人</th><th>状态</th></tr></thead>
        <tbody>
          ${MAINT_WO.map((w) => `<tr>
            <td>${w[0]}</td><td>${w[1]}</td><td>${w[2]}</td><td>${money(w[5])}</td><td>${w[6]}</td>
            <td><span class="badge ${w[4]}">${w[3]}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  const paint = (st) => {
    const list = st === "全部" ? ASSETS : ASSETS.filter((a) => a[4] === st);
    $("#assetBody").innerHTML = list.map((a) => `<tr>
      <td>${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td><td>${a[3]}</td>
      <td>${money(a[6])}</td><td>${a[7]}</td><td>${a[8]}</td><td>${a[9]}</td>
      <td><span class="badge ${a[5]}">${a[4]}</span></td>
    </tr>`).join("");
  };
  paint("全部");
  $$("#assetFilters button").forEach((b) => b.addEventListener("click", () => {
    $$("#assetFilters button").forEach((x) => x.classList.toggle("on", x === b));
    paint(b.dataset.st);
  }));
}

function renderArchive() {
  const total = ARCH_CATS.reduce((s, c) => s + c.n, 0);
  $("#view-archive").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">在档文件</div><div class="val">${total}</div><div class="delta">电子化 78% · 纸质柜 2 列</div></div>
      <div class="kpi"><div class="label">本月新增</div><div class="val">12</div><div class="delta">合同 6 · 图纸 4 · 证书 2</div></div>
      <div class="kpi"><div class="label">待归档 / 待修订</div><div class="val">4</div><div class="delta down">南通合同待盖章</div></div>
      <div class="kpi"><div class="label">受控图纸</div><div class="val">12</div><div class="delta">PLC / 变频器柜体</div></div>
    </div>
    <div class="whs" style="grid-template-columns:repeat(6,1fr);margin-bottom:14px">
      ${ARCH_CATS.map((c) => `
        <div class="kpi" style="min-height:110px">
          <div class="label">${c.name}</div>
          <div class="val" style="font-size:24px">${c.n}</div>
          <div class="delta">${c.hint}</div>
        </div>
      `).join("")}
    </div>
    <div class="card flat" style="margin-top:0">
      <h3>最近档案 · 合同 / 图纸 / 证书 / 人事</h3>
      <table>
        <thead><tr><th>档号</th><th>类型</th><th>标题</th><th>责任人</th><th>金额 / 备注</th><th>日期</th><th>状态</th></tr></thead>
        <tbody>
          ${ARCHIVES.map((a) => `<tr>
            <td>${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td><td>${a[3]}</td>
            <td>${a[6]}</td><td>${a[7]}</td>
            <td><span class="badge ${a[5]}">${a[4]}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFinance() {
  $("#view-finance").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">账面资金</div><div class="val">¥ 32.8 万</div><div class="delta">工行基本户 + 支付宝</div></div>
      <div class="kpi"><div class="label">本月回款</div><div class="val">¥ 19.2 万</div><div class="delta">较上月 +8.4%</div></div>
      <div class="kpi"><div class="label">应收账款</div><div class="val">¥ 24.6 万</div><div class="delta down">南通 AGV 待回款</div></div>
      <div class="kpi"><div class="label">本月利润</div><div class="val">¥ 8.4 万</div><div class="delta">收入 36.8 万 · 成本 28.4 万</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><h3>近 12 个月 · 收入 / 成本（万元）</h3><div id="chartFin" class="chart"></div></div>
      <div class="card"><h3>应收账龄</h3><div id="chartAging" class="chart"></div></div>
    </div>
    <div class="card flat">
      <h3>本月凭证 · 收付款与开票</h3>
      <table>
        <thead><tr><th>凭证号</th><th>类型</th><th>往来</th><th>金额</th><th>状态</th></tr></thead>
        <tbody>
          ${FIN_VOUCHERS.map((v) => `<tr>
            <td>${v[0]}</td><td>${v[1]}</td><td>${v[2]}</td><td>${money(v[3])}</td>
            <td><span class="badge ${v[5]}">${v[4]}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  const months = ["9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月","8月"];
  const inc = [16, 18, 21, 32, 14, 12, 22, 24, 28, 31, 34, 36.8];
  const cost = [12, 14, 16, 22, 11, 10, 16, 18, 20, 22, 24, 28.4];
  echarts.init($("#chartFin")).setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", valueFormatter: (v) => v + " 万" },
    legend: { data: ["收入", "成本"], textStyle: { color: "#8aa0b8" } },
    grid: { left: 48, right: 16, top: 32, bottom: 24 },
    xAxis: { type: "category", data: months, axisLine: { lineStyle: { color: "#335" } }, axisLabel: { color: "#8aa0b8" } },
    yAxis: { type: "value", name: "万元", nameTextStyle: { color: "#8aa0b8" }, axisLabel: { color: "#8aa0b8" }, splitLine: { lineStyle: { color: "rgba(255,255,255,.06)" } } },
    series: [
      { name: "收入", type: "bar", data: inc, itemStyle: { color: "#20f0ff" } },
      { name: "成本", type: "line", data: cost, smooth: true, lineStyle: { color: "#ffb020", width: 3 } }
    ]
  });
  echarts.init($("#chartAging")).setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "item", formatter: "{b}: {c} 万" },
    series: [{
      type: "pie", radius: ["46%", "70%"],
      label: { color: "#cfefff" },
      data: FIN_AGING.map((a) => ({ value: a.value, name: a.name }))
    }]
  });
}

const titles = {
  wall: "中控大屏 / 工业互联网",
  dash: "指挥舱 / 经营看板",
  products: "产品中心 / 自动化设备与工业互联网",
  orders: "销售订单 / 本周客户合同",
  mes: "智能制造 / MES 与产线节拍",
  iot: "设备物联 / PLC · 变频器 · 伺服孪生",
  equip: "设备管理 / 固定资产与维保",
  stock: "库存管理 / 仓配一体",
  archive: "档案管理 / 合同 · 图纸 · 证书",
  finance: "财务管理 / 资金 · 应收 · 凭证",
  hr: "人力资源 / 组织 · 出勤 · 岗位"
};

const renderers = {
  wall: renderWall, dash: renderDash, products: renderProducts, orders: renderOrders, mes: renderMes,
  iot: renderIot, equip: renderEquip, stock: renderStock, archive: renderArchive,
  finance: renderFinance, hr: renderHr
};

function show(view) {
  stopWallLive();
  document.body.classList.toggle("wall-mode", view === "wall");
  $$(".view").forEach((v) => v.classList.remove("show"));
  $(`#view-${view}`).classList.add("show");
  $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $("#crumb").textContent = titles[view];
  renderers[view]();
}

$$("#nav button").forEach((b) => b.addEventListener("click", () => show(b.dataset.view)));

setInterval(() => {
  const t = nowStr();
  const c = $("#clock");
  if (c) c.textContent = t;
  const w = $("#wallClock");
  if (w) w.textContent = t;
}, 1000);
$("#clock").textContent = nowStr();

let demoTimer = null;
const demoOrder = ["wall", "dash", "products", "orders", "mes", "iot", "equip", "stock", "archive", "finance", "hr"];
$("#btnDemo").addEventListener("click", () => {
  const btn = $("#btnDemo");
  if (demoTimer) {
    clearInterval(demoTimer);
    demoTimer = null;
    btn.textContent = "▶ 自动演示（录屏）";
    btn.classList.remove("run");
    return;
  }
  btn.textContent = "■ 停止";
  btn.classList.add("run");
  let i = 0;
  show(demoOrder[0]);
  demoTimer = setInterval(() => {
    i = (i + 1) % demoOrder.length;
    show(demoOrder[i]);
  }, 3500);
});

show("wall");
window.addEventListener("resize", () => {
  wallCharts.forEach((c) => { try { c.resize(); } catch (e) { /* ignore */ } });
});
setInterval(() => {
  const el = $("#kpiGmv");
  if (!el) return;
  const base = 86400 + Math.round(Math.random() * 18600);
  el.textContent = money(base);
}, 2500);

if (location.search.includes("demo=1")) {
  $("#btnDemo").click();
}

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
        <h1>码农老赵工业互联网 · 集团指挥舱</h1>
        <p>连接 128 家工厂 · 46,800 台设备 · 实时看见订单、产线、能耗与质量</p>
      </div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="label">今日成交额</div><div class="val" id="kpiGmv">¥ 18,642,000</div><div class="delta">较昨日 +12.8%</div></div>
      <div class="kpi"><div class="label">在制工单</div><div class="val" id="kpiWo">1,284</div><div class="delta">准交率 96.4%</div></div>
      <div class="kpi"><div class="label">设备在线率</div><div class="val" id="kpiOnline">98.6%</div><div class="delta">掉线 17 台 · 自动工单已派</div></div>
      <div class="kpi"><div class="label">本月新增合同</div><div class="val">¥ 2.37 亿</div><div class="delta down">回款周期 41 天</div></div>
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
  const hw = [420, 480, 510, 690, 430, 390, 620, 710, 760, 820, 880, 940];
  const sw = [80, 95, 110, 140, 120, 100, 150, 170, 190, 210, 230, 260];
  const sales = echarts.init($("#chartSales"));
  sales.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: { data: ["硬件订货", "软件/订阅"], textStyle: { color: "#8aa0b8" } },
    grid: { left: 40, right: 16, top: 32, bottom: 24 },
    xAxis: { type: "category", data: months, axisLine: { lineStyle: { color: "#335" } }, axisLabel: { color: "#8aa0b8" } },
    yAxis: { type: "value", axisLabel: { color: "#8aa0b8" }, splitLine: { lineStyle: { color: "rgba(255,255,255,.06)" } } },
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
    "上海临港 · AGV H3 完成 126 次线边配送"
  ];
  const feed = $("#feed");
  feed.innerHTML = events.map((e, i) => `<div>${i === 0 ? "●" : "○"} ${e}</div>`).join("");
}

function renderProducts() {
  const autoN = PRODUCTS.filter((p) => p.cat === "自动化设备").length;
  $("#view-products").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">在售 SKU</div><div class="val">${PRODUCTS.length}</div><div class="delta">工联网 ${PRODUCTS.length - autoN} · 自动化 ${autoN}</div></div>
      <div class="kpi"><div class="label">目录均价</div><div class="val">${money(Math.round(PRODUCTS.reduce((s,p)=>s+p.price,0)/PRODUCTS.length))}</div><div class="delta">含 PLC / 变频器 / 伺服</div></div>
      <div class="kpi"><div class="label">可售库存</div><div class="val">${PRODUCTS.reduce((s,p)=>s+p.stock,0).toLocaleString()}</div><div class="delta">4 仓协同</div></div>
      <div class="kpi"><div class="label">爆款</div><div class="val">G7 变频器</div><div class="delta">本周渠道加单 60 台</div></div>
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
      <h3>本周头部客户订单 · 工业互联网产品</h3>
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
      <div class="kpi"><div class="label">今日产出</div><div class="val">18,420 pcs</div><div class="delta">计划达成 104%</div></div>
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
      <div class="kpi"><div class="label">存货总额</div><div class="val">¥ 3.75 亿</div><div class="delta">较上月 +4.2%</div></div>
      <div class="kpi"><div class="label">SKU / 库位</div><div class="val">3,526</div><div class="delta">利用率 69%</div></div>
      <div class="kpi"><div class="label">今日出入库</div><div class="val">186 单</div><div class="delta">入 74 · 出 112</div></div>
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
      <div class="kpi"><div class="label">在册人数</div><div class="val">379</div><div class="delta">本月入职 6 · 离职 1</div></div>
      <div class="kpi"><div class="label">今日出勤率</div><div class="val">95.2%</div><div class="delta">实到 361 人</div></div>
      <div class="kpi"><div class="label">人均产值</div><div class="val">¥ 62.4 万</div><div class="delta">较去年 +11%</div></div>
      <div class="kpi"><div class="label">招聘进行中</div><div class="val">14</div><div class="delta">PLC 工程师 4 · 伺服 2</div></div>
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

const titles = {
  dash: "指挥舱 / 集团经营看板",
  products: "产品中心 / 自动化设备与工业互联网",
  orders: "销售订单 / 头部客户合同",
  mes: "智能制造 / MES 与产线节拍",
  iot: "设备物联 / PLC · 变频器 · 伺服孪生",
  stock: "库存管理 / 仓配一体",
  hr: "人力资源 / 组织 · 出勤 · 岗位"
};

const renderers = { dash: renderDash, products: renderProducts, orders: renderOrders, mes: renderMes, iot: renderIot, stock: renderStock, hr: renderHr };

function show(view) {
  $$(".view").forEach((v) => v.classList.remove("show"));
  $(`#view-${view}`).classList.add("show");
  $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $("#crumb").textContent = titles[view];
  renderers[view]();
}

$$("#nav button").forEach((b) => b.addEventListener("click", () => show(b.dataset.view)));

setInterval(() => { $("#clock").textContent = nowStr(); }, 1000);
$("#clock").textContent = nowStr();

let demoTimer = null;
const demoOrder = ["dash", "products", "orders", "mes", "iot", "stock", "hr"];
$("#btnDemo").addEventListener("click", () => {
  const btn = $("#btnDemo");
  if (demoTimer) {
    clearInterval(demoTimer);
    demoTimer = null;
    btn.textContent = "▶ 自动巡航（录屏）";
    btn.classList.remove("run");
    $("#recBadge").classList.add("hidden");
    return;
  }
  btn.textContent = "■ 停止巡航";
  btn.classList.add("run");
  $("#recBadge").classList.remove("hidden");
  let i = 0;
  show(demoOrder[0]);
  demoTimer = setInterval(() => {
    i = (i + 1) % demoOrder.length;
    show(demoOrder[i]);
  }, 7000);
});

show("dash");
setInterval(() => {
  const el = $("#kpiGmv");
  if (!el) return;
  const base = 18642000 + Math.round(Math.random() * 80000);
  el.textContent = money(base);
}, 2500);

if (location.search.includes("demo=1")) {
  $("#btnDemo").click();
}

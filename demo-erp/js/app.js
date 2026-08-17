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
        <h1>星枢工业互联网 · 集团指挥舱</h1>
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
        { value: 32, name: "边缘网关" },
        { value: 18, name: "机器视觉" },
        { value: 14, name: "传感器" },
        { value: 12, name: "PLC/控制" },
        { value: 11, name: "5G 模组" },
        { value: 13, name: "软件订阅" }
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
    "合肥锂电 · 震感 Pro 预警主轴 3# 频谱异常",
    "上海临港 · AGV H3 完成 126 次线边配送",
    "深圳宝安 · Eye 8K 检出 3 处焊点虚焊并闭环",
    "苏州仓 · EdgeBox 9000 安全库存触发补货",
    "青岛压铸 · 能效哨兵离线，运维工单已自动生成",
    "宜宾基地 · 80 台网关完成 OTA 并恢复生产"
  ];
  const feed = $("#feed");
  feed.innerHTML = events.map((e, i) => `<div>${i === 0 ? "●" : "○"} ${e}</div>`).join("");
}

function renderProducts() {
  $("#view-products").innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="label">在售 SKU</div><div class="val">${PRODUCTS.length}</div><div class="delta">工业互联网硬件 + 软件</div></div>
      <div class="kpi"><div class="label">目录均价</div><div class="val">${money(Math.round(PRODUCTS.reduce((s,p)=>s+p.price,0)/PRODUCTS.length))}</div><div class="delta">含订阅套件</div></div>
      <div class="kpi"><div class="label">可售库存</div><div class="val">${PRODUCTS.reduce((s,p)=>s+p.stock,0).toLocaleString()}</div><div class="delta">3 仓协同</div></div>
      <div class="kpi"><div class="label">爆款</div><div class="val">EdgeBox 9000</div><div class="delta">本周加单 160 台</div></div>
    </div>
    <div class="products">
      ${PRODUCTS.map((p) => `
        <article class="product">
          <img src="${p.img}" alt="${p.name}" />
          <div class="meta">
            <h4>${p.name}</h4>
            <div class="sku">SKU ${p.id}</div>
            <p>${p.desc}</p>
            <div class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
            <div class="price-row"><span class="price">${money(p.price)}</span><span class="stock">库存 ${p.stock}</span></div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
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
    <div class="whs">
      ${WAREHOUSES.map((w) => `
        <div class="kpi" style="min-height:160px">
          <div class="label">${w.name}</div>
          <div class="val">${w.sku} SKU</div>
          <div class="delta">存货 ${w.value} · 周转 ${w.turnover}</div>
        </div>
      `).join("")}
    </div>
    <div class="card" style="margin-top:14px;min-height:auto">
      <h3>安全库存预警</h3>
      <table>
        <thead><tr><th>物料</th><th>仓</th><th>现存量</th><th>安全库存</th><th>建议</th></tr></thead>
        <tbody>
          <tr><td>EdgeBox 9000 主板</td><td>苏州</td><td>42</td><td>80</td><td><span class="badge warn">加急采购</span></td></tr>
          <tr><td>Eye 8K CMOS</td><td>前海</td><td>18</td><td>30</td><td><span class="badge bad">缺料风险</span></td></tr>
          <tr><td>5G 模组 M2</td><td>苏州</td><td>2100</td><td>800</td><td><span class="badge ok">充足</span></td></tr>
          <tr><td>AGV 锂电池包</td><td>成都</td><td>9</td><td>12</td><td><span class="badge warn">调拨中</span></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

const titles = {
  dash: "指挥舱 / 集团经营看板",
  products: "产品中心 / 工业互联网硬件与软件",
  orders: "销售订单 / 头部客户合同",
  mes: "智能制造 / MES 与产线节拍",
  iot: "设备物联 / 孪生与预警",
  stock: "仓储库存 / 三仓协同"
};

const renderers = { dash: renderDash, products: renderProducts, orders: renderOrders, mes: renderMes, iot: renderIot, stock: renderStock };

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
const demoOrder = ["dash", "products", "orders", "mes", "iot", "stock"];
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

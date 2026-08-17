const PRODUCTS = [
  {
    id: "SA-EG-9000",
    name: "星枢 EdgeBox 9000 边缘网关",
    img: "img/product-edge-gateway.jpg",
    price: 12800,
    stock: 236,
    tags: ["边缘计算", "5G/TSN", "OPC UA"],
    desc: "面向离散制造的工业边缘网关，支持 32 路设备接入、本地推理与断网续传，是数字车间的神经中枢。"
  },
  {
    id: "SA-CAM-8K",
    name: "赫兹 Eye 8K 工业智能相机",
    img: "img/product-smart-camera.jpg",
    price: 18600,
    stock: 94,
    tags: ["机器视觉", "AOI", "AI 缺陷检测"],
    desc: "8K 全局快门 + 片上 AI，用于 PCB、锂电极片与精密装配的毫秒级外观检测。"
  },
  {
    id: "SA-VB-PRO",
    name: "震感 Pro 无线振动传感器",
    img: "img/product-vibration-sensor.jpg",
    price: 2680,
    stock: 1280,
    tags: ["预测性维护", "LoRa", "IP67"],
    desc: "磁吸安装，监测主轴/风机振动频谱，提前 14 天预警轴承失效，降低非计划停机。"
  },
  {
    id: "SA-5G-M2",
    name: "凌云 5G 工业模组 M2",
    img: "img/product-5g-module.jpg",
    price: 890,
    stock: 5400,
    tags: ["5G RedCap", "低时延", "模组"],
    desc: "工业级 5G RedCap 模组，宽温 -40~85℃，用于 AGV、PLC 远程运维与厂区专网接入。"
  },
  {
    id: "SA-PLC-800",
    name: "天工 PLC-800 控制器",
    img: "img/product-plc.jpg",
    price: 6420,
    stock: 410,
    tags: ["运动控制", "EtherCAT", "安全"],
    desc: "紧凑型高性能 PLC，纳秒级同步，覆盖包装、3C 装配与新能源产线的多轴协同。"
  },
  {
    id: "SA-PAD-X",
    name: "星枢工业平板 PAD-X",
    img: "img/product-tablet.jpg",
    price: 4999,
    stock: 188,
    tags: ["MES 终端", "三防", "扫码"],
    desc: "产线侧 MES/安灯终端，手套可操作，支持工艺下发、质量采集与电子工单。"
  },
  {
    id: "SA-AGV-H3",
    name: "智航 AGV H3 调度本体",
    img: "img/product-agv.jpg",
    price: 128000,
    stock: 27,
    tags: ["AMR", "激光 SLAM", "调度"],
    desc: "2 吨级潜藏式 AMR，接入星枢调度大脑，与 WMS/MES 联动完成线边物流。"
  },
  {
    id: "SA-AR-G1",
    name: "巡检官 AR 工业眼镜",
    img: "img/product-ar-glasses.jpg",
    price: 15900,
    stock: 76,
    tags: ["远程协助", "SOP", "数字孪生"],
    desc: "把工艺卡片与设备点云叠到现实视野，专家可远程标注，一线 3 分钟完成复杂点检。"
  },
  {
    id: "SA-EM-200",
    name: "能效哨兵 EM-200 电表网关",
    img: "img/product-energy-gateway.jpg",
    price: 2180,
    stock: 860,
    tags: ["能耗", "碳排", "峰谷电"],
    desc: "车间级电能与碳排采集，识别空载浪费用电，平均帮助工厂月省 8%~12% 电费。"
  }
];

const ORDERS = [
  ["SO-260817-0192", "宁德时代 · 宜宾基地", "EdgeBox 9000 × 80", 1024000, "已回款", "ok"],
  ["SO-260817-0188", "比亚迪 弗迪精工", "Eye 8K 相机 × 24", 446400, "生产中", "info"],
  ["SO-260816-0171", "中联重科 智慧工厂", "AGV H3 × 6", 768000, "待发运", "warn"],
  ["SO-260816-0164", "海康机器人 生态伙伴", "5G 模组 M2 × 2000", 1780000, "已发货", "ok"],
  ["SO-260815-0152", "上汽大众 仪征", "震感 Pro × 420", 1125600, "质检中", "info"],
  ["SO-260815-0147", "三一重工 18 号工厂", "PLC-800 × 36", 231120, "审批中", "warn"],
  ["SO-260814-0133", "富士康 工业互联网", "AR 眼镜 × 50", 795000, "已关闭", "ok"],
  ["SO-260814-0128", "中控技术 伙伴订单", "能效哨兵 × 300", 654000, "部分缺料", "bad"]
];

const DEVICES = [
  ["EG-SH-0012", "上海临港工厂", "EdgeBox", "在线", "ok", "CPU 41%"],
  ["CAM-SZ-0088", "深圳宝安 SMT", "智能相机", "在线", "ok", "节拍 1.2s"],
  ["VB-HF-1204", "合肥锂电车间", "振动传感", "预警", "warn", "加速度↑"],
  ["AGV-WZ-0007", "无锡仓储", "AMR", "在线", "ok", "电量 76%"],
  ["PLC-CD-0031", "成都装配线", "PLC", "在线", "ok", "循环 0.8ms"],
  ["EM-QD-0022", "青岛压铸", "能效网关", "离线", "bad", "心跳丢失"],
  ["PAD-TJ-0155", "天津总装", "工业平板", "在线", "ok", "工单 14"],
  ["AR-WH-0004", "武汉售后", "AR 眼镜", "作业中", "info", "远程连线"]
];

const LINES = [
  { name: "SMT 贴装一线", plant: "深圳宝安", progress: 86, oee: 91 },
  { name: "电芯卷绕二线", plant: "合肥新站", progress: 72, oee: 88 },
  { name: "总装数字化岛", plant: "上海临港", progress: 64, oee: 84 },
  { name: "结构件机加单元", plant: "苏州工业园", progress: 93, oee: 90 }
];

const WAREHOUSES = [
  { name: "华东中心仓 · 苏州", sku: 1284, value: "¥ 1.86 亿", turnover: "18 天" },
  { name: "华南保税仓 · 前海", sku: 860, value: "¥ 0.94 亿", turnover: "12 天" },
  { name: "西南协同仓 · 成都", sku: 410, value: "¥ 0.41 亿", turnover: "22 天" }
];

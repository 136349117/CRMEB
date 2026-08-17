# REBUILD 开源社区版（云端 Agent）

在 Cursor Cloud Agent 里用官方 Docker Compose 安装 [REBUILD](https://getrebuild.com/) 免费版（GPL-3.0 / 开源社区版）。

## 访问

- 地址：http://127.0.0.1:18080/
- 账号：`admin`
- 密码：`admin`
- 授权：开源社区版（OSC）

这是官方 `getrebuild/rebuild:latest` 镜像 + MySQL 5.7，启动参数 `-Dinitialize=docker` 会自动建库，无需再走网页安装向导。

## 本机 / 当前 Agent 手动启停

```bash
export DOCKER_HOST=tcp://127.0.0.1:2375
bash rebuild-cloud/install.sh   # 首次：安装 Docker CLI 并拉取镜像
bash rebuild-cloud/start.sh     # 启动 MySQL + REBUILD
```

停止：

```bash
export DOCKER_HOST=tcp://127.0.0.1:2375
docker compose -f rebuild-cloud/docker-compose.yml down
```

新的 Cloud Agent 会通过 `.cursor/environment.json` 的 `install` / `start` 自动拉镜像并启动。

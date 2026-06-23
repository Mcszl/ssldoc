---
description: EveryoneTrust SSL 文档，覆盖 SSL/TLS 证书购买、申请、域名验证、部署、续期与自动化。
layout: home

hero:
  name: EveryoneTrust SSL
  text: SSL/TLS 证书文档中心
  tagline: 从证书选型、购买下单、DCV 验证到部署续期与自动化管理，一站式完成 HTTPS 运维。
  actions:
    - theme: brand
      text: 开始阅读
      link: '#quick-start'
    - theme: alt
      text: 进入控制台
      link: https://shop.ywxmz.com/console/
    - theme: alt
      text: 查看价格
      link: https://shop.ywxmz.com/price.html
  image:
    src: https://cos-ssldoc.ywxmz.com/spaceFiles/1/nS3DUXtiobRsMPxGnTNDzt.png
    alt: EveryoneTrust SSL

features:
  - icon: 🔐
    title: 证书全流程
    details: 覆盖产品选择、提交订单、完成验证、下载证书、部署上线和到期续费。
  - icon: 🌐
    title: 域名验证指南
    details: 梳理 DNS、CNAME、HTTP 文件和邮箱验证的适用场景与检查方法。
  - icon: ⚙️
    title: 自动化能力
    details: 配合 DNS 授权、证书监控和自动化流水线，减少重复操作和人为遗漏。
  - icon: 🧭
    title: 运维手册
    details: 提供 Nginx、Apache、CDN、负载均衡和常见故障排查的实用清单。
---

## 快速开始 {#quick-start}

按你当前要完成的事情选择入口：

| 任务 | 阅读方向 |
| --- | --- |
| 购买证书 | 在控制台选择产品，填写域名信息并提交订单。 |
| 完成域名验证 | 优先使用 DNS/CNAME 验证，便于自动签发和后续续期。 |
| 部署证书 | 下载证书链和私钥后，部署到 Web 服务器、CDN 或负载均衡。 |
| 持续运维 | 开启证书监控，配置续期提醒或自动化部署流程。 |

::: tip 推荐流程
生产站点建议先配置 DNS 授权，再购买证书并使用 DNS 验证。这样后续签发、重签和续期会更稳定。
:::

## Nginx 部署示例

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /etc/nginx/ssl/example.com/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/example.com/private.key;
}
```

::: warning 私钥必须妥善保管
不要把私钥发送到聊天工具、工单、公开仓库或不受信任的第三方页面。
:::

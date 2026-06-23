---
description: 将已签发的 SSL/TLS 证书部署到 Nginx、Apache、CDN 或负载均衡。
---

# 证书部署

证书签发后，需要把证书链和私钥部署到实际提供 HTTPS 的服务上。

## 常见文件

| 文件 | 用途 |
| --- | --- |
| `fullchain.pem` | 服务器证书和中间证书链。 |
| `private.key` | 与证书匹配的私钥。 |
| `ca_bundle.pem` | 部分平台要求单独上传的中间证书链。 |

## Nginx

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /etc/nginx/ssl/example.com/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/example.com/private.key;
}
```

## Apache

```apache
<VirtualHost *:443>
  ServerName example.com
  SSLEngine on
  SSLCertificateFile /etc/ssl/example.com/fullchain.pem
  SSLCertificateKeyFile /etc/ssl/example.com/private.key
</VirtualHost>
```

::: tip 部署后验证
每次部署后都建议使用证书检测工具检查证书链、域名匹配和到期时间。
:::

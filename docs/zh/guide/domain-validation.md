---
description: 使用 DNS、CNAME、HTTP 文件或邮箱完成 SSL 证书域名控制权验证。
---

# 域名验证

域名控制权验证通常称为 DCV，用于向 CA 证明你可以控制订单中的域名。

## 验证方式

| 方式 | 适用场景 | 说明 |
| --- | --- | --- |
| DNS TXT | 大多数生产网站 | 稳定，适合自动化。 |
| CNAME | CA 自动验证 | 适合服务商给出 CNAME 目标的场景。 |
| HTTP 文件 | 简单 Web 主机 | 要求公网可以访问指定文件路径。 |
| 邮箱 | 传统域名审批 | 依赖管理员邮箱可用。 |

::: tip 推荐
如果你希望后续自动签发、重签和续期，优先使用 DNS 或 CNAME 验证。
:::

## DNS 检查清单

1. 按订单页要求添加 TXT 或 CNAME 记录。
2. 等待 DNS 解析生效。
3. 回到控制台重新检查验证状态。
4. 证书签发前不要删除验证记录。

```bash
dig TXT _acme-challenge.example.com
dig CNAME _validation.example.com
```

::: warning
部分 DNS 服务商会自动补全根域名。如果控制台显示 `_acme-challenge.example.com`，不要误建成 `_acme-challenge.example.com.example.com`。
:::

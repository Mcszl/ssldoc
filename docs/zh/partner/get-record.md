# 重新获取验证信息接口

合作商提交证书申请后，可通过本接口按订单号重新获取域名验证信息。接口只读取数据库中已经保存的 `verification_info` 与 `dcv_info`，并按控制台签发信息接口一致的规则返回 DNS、文件和邮箱验证记录。

::: tip 说明
本接口只用于读取已保存的验证记录，不会重新提交证书申请，不会请求上游 CA 刷新记录，也不会触发域名验证或签发完成检查。首次提交证书申请请使用“提交证书申请接口”。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/GetRecord/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |

## 请求示例

### JSON 请求

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234"
}
```

### 使用请求头鉴权

```bash
curl -X POST "https://example.com/partner/GetRecord/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "order_no": "CERT202607041730001234"
  }'
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.order_no` | string | 订单号。 |
| `data.cert_status` | integer | 本地证书状态。 |
| `data.verification_method` | string | 当前验证方式，常见值：`dns`、`file`、`email`。 |
| `data.main_domain` | string | 主域名。 |
| `data.sans_domains` | array | 附加单域名列表。 |
| `data.wildcard_domains` | array | 附加通配符域名列表。 |
| `data.all_domains` | array | 本证书需要验证的全部域名。 |
| `data.all_domains_count` | integer | 需要验证的域名数量。 |
| `data.dns_records` | array | DNS 验证记录。 |
| `data.http_records` | array | 文件验证记录。 |
| `data.email_records` | array | 邮箱验证信息。 |
| `data.fetched_at` | string/null | 验证信息获取时间，ISO 8601 格式。 |

### DNS 验证记录字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 需要验证的域名。 |
| `record_type` | string | DNS 记录类型，通常为 `TXT` 或 `CNAME`。 |
| `label` | string | 主机记录。返回相对主机记录，适合直接填写到对应域名的 DNS 服务商。 |
| `value` | string | 记录值。 |
| `type` | string | 域名类型：`main` 主域名、`san` 附加单域名、`wildcard` 通配符域名。 |

### 文件验证记录字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 需要验证的域名。 |
| `type` | string | 固定为 `file`。 |
| `path` | string | 文件验证 URL 或路径。 |
| `content` | string | 文件内容。 |

### 邮箱验证记录字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 需要验证的域名。 |
| `email` | string | 验证邮箱。 |
| `type` | string | 域名类型：`main`、`san`、`wildcard`。 |

## 响应示例

```json
{
  "code": 200,
  "message": "获取验证信息成功",
  "data": {
    "order_no": "CERT202607041730001234",
    "cert_status": 2,
    "verification_method": "dns",
    "main_domain": "example.com",
    "sans_domains": ["www.example.com"],
    "wildcard_domains": [],
    "all_domains": ["example.com", "www.example.com"],
    "all_domains_count": 2,
    "dns_records": [
      {
        "domain": "example.com",
        "record_type": "CNAME",
        "label": "_certum",
        "value": "example.com.validation.ca.example",
        "type": "main"
      }
    ],
    "http_records": [],
    "email_records": [],
    "fetched_at": "2026-07-13T16:40:00+08:00"
  }
}
```

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、证书状态不允许查看，或订单状态不允许此操作。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在，或订单不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

## 注意事项

- `order_no` 必须属于当前 API Key 对应的用户，否则返回 `404`。
- 订单需要先通过“提交证书申请接口”提交并保存验证信息；如果本地尚未保存验证信息，记录数组会为空。
- 接口不会请求上游 CA 刷新记录，也不会返回内部 `order_id`、`cert_id` 或上游 CA 订单号。
- DNS 验证记录中的 `label` 已按域名归一化为相对主机记录，通常可直接填写到对应域名的 DNS 控制台。

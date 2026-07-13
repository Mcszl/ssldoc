# 更改验证方式接口

合作商提交证书申请后，如果证书仍处于“正在签发”状态，可通过本接口按订单号切换域名验证方式。接口会调用上游 CA 的验证方式切换接口，并将新的验证信息写入本地证书记录。

::: tip 路径说明
接口路径中的 `ChangeVertificationMethod` 按系统接口命名保留，请调用 `/partner/ChangeVertificationMethod/`。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/ChangeVertificationMethod/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |
| `method` | string | 是 | 新验证方式。也兼容 `verification_method`、`verif_method`。 |
| `email_suffix` | string | 条件必填 | 当 `method` 传 `email` 时必填，可选：`admin`、`postmaster`、`webmaster`、`hostmaster`。 |

`method` 推荐直接传产品支持的验证方式代码，例如：

| method | 说明 |
| --- | --- |
| `dns` | DNS TXT 验证。 |
| `cname` | CNAME 验证，需产品支持。 |
| `file` | 文件验证。 |
| `email-admin` | 管理员邮箱验证：admin / administrator。 |
| `email-postmaster` | 管理员邮箱验证：postmaster。 |
| `email-webmaster` | 管理员邮箱验证：webmaster。 |
| `email-hostmaster` | 管理员邮箱验证：hostmaster。 |
| `dcv` | DCV 验证，需产品支持。 |

## 请求示例

### 切换为 DNS 验证

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "method": "dns"
}
```

### 切换为邮箱验证

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "method": "email-admin"
}
```

也可以使用 `method=email` 加 `email_suffix`：

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "method": "email",
  "email_suffix": "postmaster"
}
```

### 使用请求头鉴权

```bash
curl -X POST "https://example.com/partner/ChangeVertificationMethod/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "order_no": "CERT202607041730001234",
    "method": "file"
  }'
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.order_no` | string | 订单号。 |
| `data.cert_status` | integer | 本地证书状态，切换成功时通常为 `2`。 |
| `data.verification_method` | string | 切换后的验证方式代码。 |
| `data.dns_records` | array | DNS 验证记录。 |
| `data.http_records` | array | 文件验证记录。 |
| `data.email_records` | array | 邮箱验证信息。 |
| `data.request_id` | string | 请求 ID，用于排查问题。 |

### DNS 验证记录字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 需要验证的域名。 |
| `type` | string | 域名类型：`main`、`san`、`wildcard`。 |
| `record_type` | string | DNS 记录类型，通常为 `TXT` 或 `CNAME`。 |
| `label` | string | 主机记录。 |
| `value` | string | 记录值。 |

### 文件验证记录字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 需要验证的域名。 |
| `type` | string | 域名类型：`main`、`san`、`wildcard`。 |
| `record_type` | string | 固定为 `FILE`。 |
| `label` | string | 文件名。 |
| `path` | string | 文件验证 URL 或路径。 |
| `content` | string | 文件内容。 |
| `link` | string | 上游返回的原始链接。 |

### 邮箱验证记录字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 需要验证的域名。 |
| `type` | string | 域名类型：`main`、`san`、`wildcard`。 |
| `email` | string | 验证邮箱。 |

## 响应示例

```json
{
  "code": 200,
  "message": "验证方式已切换为「DNS 验证」",
  "data": {
    "order_no": "CERT202607041730001234",
    "cert_status": 2,
    "verification_method": "dns",
    "dns_records": [
      {
        "domain": "example.com",
        "type": "main",
        "record_type": "TXT",
        "label": "_dnsauth",
        "value": "verification-value"
      }
    ],
    "http_records": [],
    "email_records": [],
    "request_id": "SIG-202607131900000000-ABC123"
  }
}
```

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、验证方式不支持、产品不支持该验证方式、证书状态不允许切换，或上游 CA 返回切换失败。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在，订单不属于当前 API Key 对应用户，或产品不存在。 |
| `405` | 请求方式错误。 |
| `429` | 同一证书 5 分钟内重复切换验证方式。 |
| `500` | 服务器错误。 |

## 注意事项

- `order_no` 必须属于当前 API Key 对应的用户，否则返回 `404`。
- 仅证书状态为 `2`（正在签发）时允许切换验证方式。
- 证书必须已经提交到 CA 并产生上游订单号。
- 新验证方式必须同时满足“系统启用”和“产品支持”两个条件。
- 切换成功后，请使用返回的新验证记录完成域名验证。

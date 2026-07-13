# 提交证书申请接口

合作商创建订单并完成扣款后，可通过本接口按订单号提交证书签发申请。接口会复用后台签发引擎，完成订单归属校验、证书状态校验、订单内 CSR 校验、上游 CA 申请提交，并返回域名验证记录。

::: tip 说明
本接口中的“密钥”指合作商 API 密钥，不是 SSL 证书私钥。签发阶段不再接收 CSR；如需使用自定义 CSR，请在创建订单接口中提交。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/ApplySign/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `app_id` | string | 与 `api_secret` 配套 | API Key 的 AppID。使用 `apikey` 或请求头鉴权时可不传。 |
| `api_secret` | string | 与 `app_id` 配套 | API Key Secret。使用 `apikey` 或请求头鉴权时可不传。 |
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
curl -X POST "https://example.com/partner/ApplySign/" \
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
| `data.cert_status` | integer | 本地证书状态，`2` 表示正在签发 / 等待完成验证。 |
| `data.verification_method` | string | 当前验证方式，常见值：`dns`、`file`、`email`。 |
| `data.dns_records` | array | DNS 验证记录。 |
| `data.http_records` | array | 文件验证记录。 |
| `data.email_records` | array | 邮箱验证信息。 |
| `data.request_id` | string/null | 签发请求 ID，用于排查问题。 |

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
  "message": "证书申请已提交，请按返回的验证记录完成域名验证",
  "data": {
    "order_no": "CERT202607041730001234",
    "cert_status": 2,
    "verification_method": "dns",
    "dns_records": [
      {
        "domain": "example.com",
        "record_type": "TXT",
        "label": "_dnsauth",
        "value": "verification-value",
        "type": "main"
      }
    ],
    "http_records": [],
    "email_records": [],
    "request_id": "SIG-202607131200000000-ABC123"
  }
}
```

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、订单状态不允许签发、CSR 校验失败或上游 CA 返回错误。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在，或订单不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

## 注意事项

- `order_no` 必须属于当前 API Key 对应的用户，否则返回 `404`。
- 同一证书仅在“等待签发”或“签发失败”状态下可重新提交申请。
- 本接口不接收 `custom_csr` 或 `csr` 参数。若请求中传入非空 CSR 参数，将返回 `400`。
- 如需使用自定义 CSR，请在创建订单接口中通过 `custom_csr` 提交；签发时会使用订单证书记录中已保存的 CSR。
- 订单中已保存的 CSR 会由签发引擎校验证书域名、SAN、通配符和 OV / EV 组织信息是否匹配订单。
- 提交成功后请根据 `dns_records`、`http_records` 或 `email_records` 完成域名验证。

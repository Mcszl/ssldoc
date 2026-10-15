# 通过证书 ID 获取证书内容接口

合作商可通过证书 ID 获取指定证书的状态、有效期、域名、算法、公钥、私钥、证书链、仅叶子证书、仅中间证书及 CSR。

::: danger 私钥安全
本接口返回私钥。请只在可信服务端调用，并限制 API Key 的使用环境和允许 IP。不要将完整响应写入日志。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `https://shop.everyonetrust.com/partner/GetCertificateContent/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `cert_id` | string | 是 | 证书 UUID。也兼容 `certificate_id`。 |

## 请求示例

```bash
curl -X POST "https://shop.everyonetrust.com/partner/GetCertificateContent/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333"
  }'
```

::: warning 请求域名
请直接请求 `shop.everyonetrust.com`。旧域名 `shop.ywxmz.com` 会先重定向到新域名，部分 HTTP 客户端跟随 301/302 时会把 POST 改为 GET 并丢弃请求体，进而收到 `405`。
:::

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.cert_id` | string | 证书唯一 ID。 |
| `data.installment_no` | integer | 当前证书期数。 |
| `data.installments_count` | integer | 订单理论总期数。 |
| `data.parent_cert_id` | string/null | 前一张关联证书 ID。 |
| `data.cert_status` | integer | 证书状态码。 |
| `data.cert_status_label` | string | 证书状态名称。 |
| `data.lifecycle_status` | string | 证书有效性状态。 |
| `data.lifecycle_status_label` | string | 有效性状态中文名称。 |
| `data.order_no` | string | 所属订单号。 |
| `data.order_status` | integer | 订单状态码。 |
| `data.order_status_label` | string | 订单状态名称。 |
| `data.product_name` | string | 产品名称。 |
| `data.brand_name` | string | 品牌名称。 |
| `data.main_domain` | string | 主域名。 |
| `data.sans_domains` | array | 附加单域名。 |
| `data.wildcard_domains` | array | 附加通配符域名。 |
| `data.domains` | array | 证书覆盖的全部域名。 |
| `data.signature_algorithm` | string | 签名算法。 |
| `data.hash_algorithm` | string | 哈希算法。 |
| `data.key_spec` | string | 密钥规格。 |
| `data.serial_number` | string | 证书序列号。 |
| `data.fingerprint_sha256` | string | SHA-256 指纹。 |
| `data.issued_at` | string/null | 签发时间，ISO 8601 格式。 |
| `data.valid_from` | string/null | 有效期开始时间。 |
| `data.valid_to` | string/null | 到期时间。 |
| `data.issue_error` | string/null | 签发失败原因。 |
| `data.certificate.public_key` | string | 从叶子证书提取的 PEM 公钥。 |
| `data.certificate.private_key` | string | PEM 私钥。 |
| `data.certificate.certificate_chain` | string | 完整证书链。 |
| `data.certificate.certificate_only` | string | 仅叶子证书，不含中间证书。 |
| `data.certificate.intermediate_certificate_only` | string | 仅中间证书。 |
| `data.certificate.csr` | string | PEM 格式 CSR。 |
| `data.has_public_key` | boolean | 是否成功提取公钥。 |
| `data.has_private_key` | boolean | 是否包含私钥。 |
| `data.has_certificate` | boolean | 是否包含证书链。 |
| `data.has_csr` | boolean | 是否包含 CSR。 |

`certificate` 对象还提供 `certificate_leaf`、`intermediate_certificate`、`crt`、`key` 和 `ca_bundle` 兼容别名，含义与“获取订单证书接口”一致。

## 响应示例

```json
{
  "code": 200,
  "message": "获取证书内容成功",
  "data": {
    "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
    "installment_no": 1,
    "parent_cert_id": null,
    "cert_status": 1,
    "cert_status_label": "签发成功",
    "lifecycle_status": "valid",
    "lifecycle_status_label": "有效",
    "issued_at": "2026-07-04T18:00:00+08:00",
    "valid_from": "2026-07-04T18:00:00+08:00",
    "valid_to": "2027-07-04T18:00:00+08:00",
    "order_no": "CERT202607041730001234",
    "order_status": 2,
    "order_status_label": "已完成",
    "installments_count": 2,
    "product_id": 18,
    "product_name": "DV SSL",
    "brand_id": 3,
    "brand_name": "ExampleCA",
    "main_domain": "example.com",
    "sans_domains": [],
    "wildcard_domains": [],
    "domains": ["example.com"],
    "signature_algorithm": "rsa",
    "hash_algorithm": "sha256",
    "key_spec": "rsa-2048",
    "serial_number": "0123456789ABCDEF",
    "fingerprint_sha256": "ABCDEF...",
    "issue_error": null,
    "certificate": {
      "public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n",
      "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      "certificate_chain": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
      "certificate_only": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
      "intermediate_certificate_only": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
      "csr": "-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----\n",
      "certificate_leaf": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
      "intermediate_certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
      "crt": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
      "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      "ca_bundle": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n"
    },
    "has_public_key": true,
    "has_private_key": true,
    "has_certificate": true,
    "has_csr": true
  }
}
```

## 处理规则

- `cert_id` 必须是合法 UUID，且证书与所属订单都必须属于当前 API Key 对应用户。
- 本接口允许查询未签发、失败或已吊销证书；不存在的材料字段返回空字符串。
- `public_key` 是从叶子证书中提取的真实公钥。叶子证书尚不存在或无法解析时返回空字符串。
- 本接口只读取本地数据，不会触发 CA 状态查询。需要同步签发状态时请调用“获取订单状态接口”。

## 状态说明

| `cert_status` | 说明 |
| --- | --- |
| `0` | 等待签发 |
| `1` | 签发成功 |
| `2` | 正在签发 |
| `3` | 签发失败 |
| `4` | 正在吊销 |
| `5` | 已吊销/已退款 |
| `6` | 退款中 |

签发成功后，`lifecycle_status` 进一步返回 `valid`（有效）、`expiring`（30 天内到期）或 `expired`（已过期）。

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 缺少证书 ID 或 UUID 格式错误。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 证书不存在，或证书/订单不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

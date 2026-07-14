# 下载证书接口

合作商可通过本接口按订单号下载已签发证书的部署材料。接口会返回证书链、叶子证书、中间证书、私钥、CSR、指纹、序列号、域名和有效期等必要信息。

::: warning 安全提醒
响应中包含 `private_key` / `key` 私钥字段，请只在可信服务端调用并妥善保存，不要在前端页面、日志或第三方系统中明文暴露。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/DownloadCertificate/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |
| `cert_id` | string | 否 | 指定证书 ID。订单存在多期证书时可用于精确下载。也兼容 `certificate_id`。 |
| `installment_no` | integer | 否 | 指定证书期数。未传时默认返回该订单中最早一张已签发证书。 |

## 请求示例

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234"
}
```

### 指定证书 ID

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333"
}
```

### 使用请求头鉴权

```bash
curl -X POST "https://example.com/partner/DownloadCertificate/" \
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
| `data.order_status` | integer | 本地订单状态。 |
| `data.cert_id` | string | 证书 ID。 |
| `data.cert_status` | integer | 本地证书状态，下载成功时为 `1`。 |
| `data.installment_no` | integer | 当前证书期数。 |
| `data.installments_count` | integer | 订单总期数。 |
| `data.product_name` | string | 产品名称。 |
| `data.brand_name` | string | 品牌名称。 |
| `data.main_domain` | string | 主域名。 |
| `data.sans_domains` | array | 附加单域名。 |
| `data.wildcard_domains` | array | 附加通配符域名。 |
| `data.domains` | array | 证书包含的全部域名。 |
| `data.signature_algorithm` | string | 签名算法。 |
| `data.hash_algorithm` | string | 哈希算法。 |
| `data.key_spec` | string | 密钥规格。 |
| `data.serial_number` | string | 证书序列号。 |
| `data.fingerprint_sha256` | string | 证书 SHA-256 指纹。 |
| `data.issued_at` | string/null | 签发时间。 |
| `data.start_date` | string/null | 有效期开始时间。 |
| `data.end_date` | string/null | 有效期结束时间。 |
| `data.valid_from` | string/null | 有效期开始日期。 |
| `data.valid_to` | string/null | 有效期结束日期。 |
| `data.certificate.certificate_chain` | string | 完整证书链 PEM。 |
| `data.certificate.certificate_leaf` | string | 叶子证书 PEM。 |
| `data.certificate.intermediate_certificate` | string | 中间证书 PEM。 |
| `data.certificate.private_key` | string | 私钥 PEM。 |
| `data.certificate.csr` | string | CSR PEM。 |
| `data.certificate.crt` | string | `certificate_chain` 的部署别名。 |
| `data.certificate.key` | string | `private_key` 的部署别名。 |
| `data.certificate.ca_bundle` | string | `intermediate_certificate` 的部署别名。 |
| `data.has_certificate` | boolean | 是否包含证书内容。 |
| `data.has_private_key` | boolean | 是否包含私钥。 |
| `data.downloaded_at` | string | 本次下载时间。 |

## 响应示例

```json
{
  "code": 200,
  "message": "获取证书信息成功",
  "data": {
    "order_no": "CERT202607041730001234",
    "order_status": 2,
    "order_status_label": "已完成",
    "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
    "cert_status": 1,
    "cert_status_label": "签发成功",
    "installment_no": 1,
    "installments_count": 1,
    "product_name": "DV SSL",
    "brand_name": "ExampleCA",
    "main_domain": "example.com",
    "sans_domains": [],
    "wildcard_domains": [],
    "domains": ["example.com"],
    "years": 1,
    "signature_algorithm": "rsa",
    "hash_algorithm": "sha256",
    "key_spec": "rsa-2048",
    "verification_method": "dns",
    "serial_number": "0123456789ABCDEF",
    "fingerprint_sha256": "ABCDEF...",
    "issued_at": "2026-07-14 15:30:00",
    "start_date": "2026-07-14 15:30:00",
    "end_date": "2027-07-14 15:30:00",
    "valid_from": "2026-07-14",
    "valid_to": "2027-07-14",
    "certificate": {
      "certificate_chain": "-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n",
      "certificate_leaf": "-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n",
      "intermediate_certificate": "-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n",
      "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
      "csr": "-----BEGIN CERTIFICATE REQUEST-----\\n...\\n-----END CERTIFICATE REQUEST-----\\n",
      "crt": "-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n",
      "key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
      "ca_bundle": "-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"
    },
    "has_certificate": true,
    "has_private_key": true,
    "downloaded_at": "2026-07-14T15:40:00+08:00"
  }
}
```

## 处理规则

- `order_no` 必须属于当前 API Key 对应的用户。
- 仅证书状态为 `1`（签发成功）时允许下载。
- 如果证书已签发但本地尚未写入证书内容，请先调用“获取订单状态接口”同步证书，或稍后重试。
- 多期证书订单可通过 `cert_id` 或 `installment_no` 指定要下载的证书。

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、证书尚未签发成功，或本地尚未写入证书内容。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 证书不存在或不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

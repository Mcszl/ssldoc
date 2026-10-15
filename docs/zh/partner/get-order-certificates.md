# 获取订单证书接口

合作商可通过订单号获取该订单下的全部证书。接口按证书期数返回状态、域名、有效期、算法以及完整证书材料。

::: danger 私钥安全
响应中的 `certificate.private_key` / `certificate.key` 包含私钥。请仅在可信服务端调用，不要写入普通业务日志、浏览器缓存或第三方分析系统。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `https://shop.everyonetrust.com/partner/GetOrderCertificates/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 订单号。也兼容 `order_number`。 |

## 请求示例

```bash
curl -X POST "https://shop.everyonetrust.com/partner/GetOrderCertificates/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "order_no": "CERT202607041730001234"
  }'
```

::: warning 请求域名
请直接请求 `shop.everyonetrust.com`。旧域名 `shop.ywxmz.com` 会先重定向到新域名，部分 HTTP 客户端跟随 301/302 时会把 POST 改为 GET 并丢弃请求体，进而收到 `405`。
:::

## 响应结构

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.order` | object | 订单摘要，与“获取订单列表接口”的订单字段一致。 |
| `data.order.certificate_count` | integer | 该订单返回的证书记录数。 |
| `data.certificates` | array | 证书详情数组，按期数、创建时间和证书 ID 升序排列。 |

### 证书详情字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `cert_id` | string | 证书唯一 ID。 |
| `installment_no` | integer | 当前证书期数。 |
| `installments_count` | integer | 订单理论总期数。 |
| `parent_cert_id` | string/null | 前一张关联证书 ID。 |
| `cert_status` | integer | 证书状态码。 |
| `cert_status_label` | string | 证书状态名称。 |
| `lifecycle_status` | string | `valid`、`expiring`、`expired`、`pending`、`issuing` 等有效性状态。 |
| `lifecycle_status_label` | string | 有效性状态中文名称。 |
| `order_no` | string | 所属订单号。 |
| `order_status` | integer | 订单状态码。 |
| `product_name` | string | 产品名称。 |
| `brand_name` | string | 品牌名称。 |
| `main_domain` | string | 主域名。 |
| `sans_domains` | array | 附加单域名。 |
| `wildcard_domains` | array | 附加通配符域名。 |
| `domains` | array | 证书覆盖的全部域名。 |
| `signature_algorithm` | string | 签名算法。 |
| `hash_algorithm` | string | 哈希算法。 |
| `key_spec` | string | 密钥规格。 |
| `serial_number` | string | 证书序列号。 |
| `fingerprint_sha256` | string | SHA-256 指纹。 |
| `issued_at` | string/null | 签发时间，ISO 8601 格式。 |
| `valid_from` | string/null | 有效期开始时间。 |
| `valid_to` | string/null | 有效期结束时间。 |
| `issue_error` | string/null | 签发失败原因。 |
| `certificate` | object | 证书材料，字段见下表。 |
| `has_public_key` | boolean | 是否成功提取公钥。 |
| `has_private_key` | boolean | 是否包含私钥。 |
| `has_certificate` | boolean | 是否包含证书链。 |
| `has_csr` | boolean | 是否包含 CSR。 |

### 证书材料字段

| 参数 | 说明 |
| --- | --- |
| `public_key` | 从叶子证书提取的 PEM 公钥。 |
| `private_key` | PEM 私钥。 |
| `certificate_chain` | 完整证书链，通常包含叶子证书和中间证书。 |
| `certificate_only` | 仅叶子证书，不含中间证书。 |
| `intermediate_certificate_only` | 仅中间证书。 |
| `csr` | PEM 格式 CSR。 |
| `certificate_leaf` | `certificate_only` 的兼容别名。 |
| `intermediate_certificate` | `intermediate_certificate_only` 的兼容别名。 |
| `crt` | `certificate_chain` 的部署别名。 |
| `key` | `private_key` 的部署别名。 |
| `ca_bundle` | `intermediate_certificate_only` 的部署别名。 |

## 响应示例

```json
{
  "code": 200,
  "message": "获取订单证书成功",
  "data": {
    "order": {
      "order_no": "CERT202607041730001234",
      "order_status": 2,
      "order_status_label": "已完成",
      "main_domain": "example.com",
      "installments_count": 2,
      "certificate_count": 2
    },
    "certificates": [
      {
        "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
        "installment_no": 1,
        "installments_count": 2,
        "parent_cert_id": null,
        "cert_status": 1,
        "cert_status_label": "签发成功",
        "lifecycle_status": "valid",
        "lifecycle_status_label": "有效",
        "order_no": "CERT202607041730001234",
        "main_domain": "example.com",
        "domains": ["example.com"],
        "issued_at": "2026-07-04T18:00:00+08:00",
        "valid_from": "2026-07-04T18:00:00+08:00",
        "valid_to": "2027-07-04T18:00:00+08:00",
        "certificate": {
          "public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n",
          "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
          "certificate_chain": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
          "certificate_only": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
          "intermediate_certificate_only": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n",
          "csr": "-----BEGIN CERTIFICATE REQUEST-----\n...\n-----END CERTIFICATE REQUEST-----\n"
        },
        "has_public_key": true,
        "has_private_key": true,
        "has_certificate": true,
        "has_csr": true
      }
    ]
  }
}
```

## 处理规则

- 订单必须属于当前 API Key 对应用户，否则返回 `404`。
- 接口返回订单下全部未删除证书，包括等待签发、签发失败、吊销和退款状态的记录。
- 未签发证书可能只有 CSR 或私钥，尚不存在的证书材料字段返回空字符串。
- 重签可能使同一期出现多张证书，调用方应使用 `cert_id` 区分。
- 本接口只读取本地状态，不触发上游 CA 状态同步。

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 缺少订单号或订单号格式错误。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在或不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

# 获取订单列表接口

合作商可通过本接口分页获取当前 API Key 对应用户的全部证书订单。每个订单会附带其证书 ID、期数和状态摘要，便于区分多期证书。

本接口只读取本地数据，不会请求上游 CA，也不会返回私钥或证书 PEM 内容。

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/GetOrderList/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `apikey` | string | 是 | - | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `page` | integer | 否 | `1` | 页码，从 `1` 开始。 |
| `page_size` | integer | 否 | `20` | 每页订单数，范围 `1` 到 `100`。 |

## 请求示例

```bash
curl -X POST "https://example.com/partner/GetOrderList/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "page": 1,
    "page_size": 20
  }'
```

## 响应参数

### 分页与订单

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.items` | array | 当前页订单列表。无订单时为空数组。 |
| `data.pagination.page` | integer | 当前页码。 |
| `data.pagination.page_size` | integer | 每页订单数。 |
| `data.pagination.total` | integer | 当前用户的订单总数。 |
| `data.pagination.total_pages` | integer | 总页数；无订单时为 `0`。 |
| `data.items[].order_no` | string | 订单号。 |
| `data.items[].order_status` | integer | 订单状态码。 |
| `data.items[].order_status_label` | string | 订单状态名称。 |
| `data.items[].product_id` | integer | 产品 ID。 |
| `data.items[].product_name` | string | 产品名称。 |
| `data.items[].brand_id` | integer | 品牌 ID。 |
| `data.items[].brand_name` | string | 品牌名称。 |
| `data.items[].main_domain` | string | 主域名。 |
| `data.items[].sans_domains` | array | 附加单域名。 |
| `data.items[].wildcard_domains` | array | 附加通配符域名。 |
| `data.items[].total_domains` | integer | 域名总数。 |
| `data.items[].years` | integer | 购买年限。 |
| `data.items[].installments_count` | integer | 订单理论总期数。 |
| `data.items[].total_amount` | number | 订单总金额。 |
| `data.items[].payment_method` | string | 支付方式，通常为 `balance` 或 `credit`。 |
| `data.items[].certificate_count` | integer | 当前订单已建立的证书记录数。 |
| `data.items[].certificates` | array | 当前订单的证书摘要，按期数升序排列。 |
| `data.items[].created_at` | string/null | 订单创建时间，ISO 8601 格式。 |
| `data.items[].updated_at` | string/null | 订单更新时间，ISO 8601 格式。 |

### 证书摘要

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `cert_id` | string | 证书唯一 ID。 |
| `installment_no` | integer | 证书期数，`1` 为第一期。 |
| `parent_cert_id` | string/null | 前一张关联证书 ID。 |
| `cert_status` | integer | 数据库证书状态码。 |
| `cert_status_label` | string | 数据库证书状态名称。 |
| `lifecycle_status` | string | 有效性状态，如 `valid`、`expiring`、`expired`、`issuing`。 |
| `lifecycle_status_label` | string | 有效性状态中文名称。 |
| `main_domain` | string | 证书主域名。 |
| `issued_at` | string/null | 签发时间，ISO 8601 格式。 |
| `valid_from` | string/null | 有效期开始时间。 |
| `valid_to` | string/null | 有效期结束时间。 |

## 响应示例

```json
{
  "code": 200,
  "message": "获取订单列表成功",
  "data": {
    "items": [
      {
        "order_no": "CERT202607041730001234",
        "order_status": 2,
        "order_status_label": "已完成",
        "product_id": 18,
        "product_name": "DV SSL",
        "brand_id": 3,
        "brand_name": "ExampleCA",
        "main_domain": "example.com",
        "sans_domains": [],
        "wildcard_domains": [],
        "total_domains": 1,
        "signature_algorithm": "rsa",
        "hash_algorithm": "sha256",
        "key_spec": "rsa-2048",
        "years": 2,
        "unit_price": 98,
        "installments_count": 2,
        "total_amount": 196,
        "payment_method": "balance",
        "auto_issue_enabled": true,
        "paid_at": "2026-07-04T17:30:00+08:00",
        "created_at": "2026-07-04T17:30:00+08:00",
        "updated_at": "2026-07-14T15:30:00+08:00",
        "certificate_count": 2,
        "certificates": [
          {
            "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
            "installment_no": 1,
            "parent_cert_id": null,
            "cert_status": 1,
            "cert_status_label": "签发成功",
            "lifecycle_status": "valid",
            "lifecycle_status_label": "有效",
            "main_domain": "example.com",
            "issued_at": "2026-07-04T18:00:00+08:00",
            "valid_from": "2026-07-04T18:00:00+08:00",
            "valid_to": "2027-07-04T18:00:00+08:00",
            "created_at": "2026-07-04T17:30:00+08:00"
          },
          {
            "cert_id": "5b2e0a81-2e64-4e81-9f5a-2e0a812e6444",
            "installment_no": 2,
            "parent_cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
            "cert_status": 0,
            "cert_status_label": "等待签发",
            "lifecycle_status": "pending",
            "lifecycle_status_label": "等待签发",
            "main_domain": "example.com",
            "issued_at": null,
            "valid_from": null,
            "valid_to": null,
            "created_at": "2027-06-20T10:00:00+08:00"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

## 期数与状态说明

- `installments_count` 是订单理论总期数，`installment_no` 是单张证书所在期数。
- 重签等操作可能使同一期出现多张证书记录，应使用 `cert_id` 作为证书的最终唯一标识。
- `cert_status` 表示系统处理状态；`lifecycle_status` 会在签发成功后继续区分有效、即将过期和已过期。
- `expiring` 表示证书将在 30 天内到期。

## 错误码

| code | 说明 |
| --- | --- |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

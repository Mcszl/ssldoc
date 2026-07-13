# 获取订单状态接口

合作商可通过本接口按订单号获取证书订单状态。若证书处于“正在签发”状态，接口会请求上游 CA 查询最新签发状态，并同步更新本地证书记录；其他状态会直接返回本地状态。

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/GetCertificateStatus/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |

## 频率限制

同一合作商账号下，单个订单 3 分钟内只能获取 1 次签发状态。重复请求会返回 `429`，并在 `data.retry_after` 中返回剩余等待秒数。

## 请求示例

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234"
}
```

### 使用请求头鉴权

```bash
curl -X POST "https://example.com/partner/GetCertificateStatus/" \
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
| `data.order_status_label` | string | 本地订单状态名称。 |
| `data.cert_id` | string | 证书 ID。 |
| `data.cert_status` | integer | 本地证书状态。 |
| `data.cert_status_label` | string | 本地证书状态名称。 |
| `data.ca_status` | integer/null | 上游 CA 状态码。仅请求上游后返回。 |
| `data.ca_status_text` | string/null | 上游 CA 状态文本。 |
| `data.all_dcv_verified` | boolean | 域名验证是否全部通过。 |
| `data.domain_statuses` | array | 域名验证状态列表。 |
| `data.serial_number` | string/null | 证书序列号。签发成功后返回。 |
| `data.start_date` | string/null | 证书有效期开始时间。 |
| `data.end_date` | string/null | 证书有效期结束时间。 |
| `data.request_id` | string/null | 请求 ID，用于排查上游查询问题。 |
| `data.cert_downloaded` | boolean | 本次查询是否已下载并写入证书内容。 |
| `data.source` | string | `ca` 表示本次请求了上游，`local` 表示直接返回本地状态。 |
| `data.checked_at` | string | 本次接口返回时间。 |
| `data.cooldown_seconds` | integer | 查询冷却时间，固定为 `180` 秒。 |

### 域名验证状态字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | string | 域名。 |
| `method` | string | 验证方式。 |
| `verified` | boolean | 是否已通过验证。 |

## 响应示例

### 正在签发

```json
{
  "code": 200,
  "message": "CA 正在处理中，请确认所有域名验证记录已生效",
  "data": {
    "order_no": "CERT202607041730001234",
    "order_status": 1,
    "order_status_label": "处理中",
    "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
    "cert_status": 2,
    "cert_status_label": "正在签发",
    "ca_status": 0,
    "ca_status_text": "processing",
    "all_dcv_verified": false,
    "domain_statuses": [
      {
        "domain": "example.com",
        "method": "dns",
        "verified": false
      }
    ],
    "serial_number": null,
    "start_date": null,
    "end_date": null,
    "request_id": "SIG-202607132030000000-ABC123",
    "cert_downloaded": false,
    "source": "ca",
    "checked_at": "2026-07-13T20:30:00+08:00",
    "cooldown_seconds": 180
  }
}
```

### 签发成功

```json
{
  "code": 200,
  "message": "证书已签发成功",
  "data": {
    "order_no": "CERT202607041730001234",
    "order_status": 2,
    "order_status_label": "已完成",
    "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
    "cert_status": 1,
    "cert_status_label": "签发成功",
    "ca_status": 1,
    "ca_status_text": "active",
    "all_dcv_verified": true,
    "domain_statuses": [],
    "serial_number": "0123456789ABCDEF",
    "start_date": "2026-07-13 20:30:00",
    "end_date": "2027-07-13 20:30:00",
    "request_id": "SIG-202607132030000000-ABC123",
    "cert_downloaded": true,
    "source": "ca",
    "checked_at": "2026-07-13T20:30:00+08:00",
    "cooldown_seconds": 180
  }
}
```

### 触发频率限制

```json
{
  "code": 429,
  "message": "同一订单 3 分钟内只能获取 1 次签发状态，请 120 秒后再试",
  "data": {
    "order_no": "CERT202607041730001234",
    "retry_after": 120,
    "cooldown_seconds": 180
  }
}
```

## 状态说明

### 订单状态

| 状态值 | 说明 |
| --- | --- |
| `0` | 待支付 |
| `1` | 处理中 |
| `2` | 已完成 |
| `3` | 已取消 |
| `4` | 已退款 |

### 证书状态

| 状态值 | 说明 |
| --- | --- |
| `0` | 等待签发 |
| `1` | 签发成功 |
| `2` | 正在签发 |
| `3` | 签发失败 |
| `4` | 正在吊销 |
| `5` | 已吊销/已退款 |
| `6` | 退款中 |

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、证书尚未提交 CA、未找到渠道配置，或上游状态查询失败。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在或不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `429` | 单个订单 3 分钟内重复获取签发状态。 |
| `500` | 服务器错误。 |

# 取消订单接口

合作商可通过本接口按订单号取消证书订单。系统会先自动请求上游 CA 取消订单；上游取消成功后，本地立即执行退款业务。若上游取消失败，系统会创建待审核退款申请，由管理员处理。

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/CancelOrder/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |
| `reason` | string | 否 | 取消/退款原因。 |

## 请求示例

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "reason": "客户取消申请"
}
```

### 使用请求头鉴权

```bash
curl -X POST "https://example.com/partner/CancelOrder/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "order_no": "CERT202607041730001234",
    "reason": "客户取消申请"
  }'
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示请求处理成功。 |
| `message` | string | 响应消息。 |
| `data.order_no` | string | 订单号。 |
| `data.refund_id` | integer | 本地退款记录 ID。 |
| `data.refund_amount` | number | 退款金额。 |
| `data.refund_to` | string | 退款去向：`balance` 退回余额，`credit` 退回信用额度。 |
| `data.refund_order_no` | string | 自动退款成功时生成的退款流水号。转人工审核时不返回。 |
| `data.refund_mode` | string | `direct` 表示已自动退款，`audit` 表示已转管理员审核。 |
| `data.refund_status` | integer | 退款状态：`0` 待审核，`3` 已通过。 |

## 响应示例

### 自动退款成功

```json
{
  "code": 200,
  "message": "上游订单已取消，本地订单已自动退款",
  "data": {
    "order_no": "CERT202607041730001234",
    "refund_id": 18,
    "refund_amount": 98,
    "refund_to": "balance",
    "refund_order_no": "REFUND202607131930001234",
    "refund_mode": "direct",
    "refund_status": 3
  }
}
```

### 转管理员审核

```json
{
  "code": 200,
  "message": "上游取消订单失败，退款申请已提交，请等待管理员审核",
  "data": {
    "order_no": "CERT202607041730001234",
    "refund_id": 19,
    "refund_amount": 98,
    "refund_to": "balance",
    "refund_mode": "audit",
    "refund_status": 0
  }
}
```

## 处理规则

- `order_no` 必须属于当前 API Key 对应的用户。
- 仅已支付/处理中或已完成的订单可申请取消退款。
- 证书状态需为 `0` 等待签发、`1` 签发成功、`2` 正在签发或 `3` 签发失败。
- 已退款、已取消、退款中或已有进行中退款申请的订单不能重复提交。
- 证书超过 7 天退款期限后不能通过本接口退款。
- 订单尚未提交到上游且证书仍为等待签发状态时，会跳过上游取消并直接执行本地退款。
- 上游取消失败时，本地不会自动入账退款，只会创建待审核退款申请。


## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、订单状态不支持、超过退款期限、已有退款申请，或缺少有效支付金额。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在或不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

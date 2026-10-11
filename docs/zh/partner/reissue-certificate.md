# 重新签发证书接口

合作商可为当前 API Key 所属用户的已签发证书提交重签申请。系统会检查订单归属、证书状态、产品重签开关、上游订单号、CSR 与私钥，并创建一张新的本地证书记录用于跟踪重签进度。

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/ReissueCertificate/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |
| `cert_id` | string | 否 | 要重签的源证书 ID，也兼容 `certificate_id`。订单包含多张证书时建议必传。 |
| `installment_no` | integer | 否 | 要重签的证书期数。未传 `cert_id` 时可用此字段定位证书。 |
| `csr_mode` | string | 否 | CSR 模式：`original` 沿用原 CSR 和私钥、`custom` 使用新 CSR、`auto` 由上游生成。默认 `original`。 |
| `custom_csr` | string | 条件必填 | `csr_mode=custom` 时必填，必须为 PEM 格式 CSR。也兼容 `csr`。 |
| `validation_method` | string | 否 | `none`、`dns`、`cname`、`file`、`http` 或 `https`。默认 `none`，表示沿用原验证设置且不主动要求重新验证。也兼容 `method`。 |

未传 `cert_id` 和 `installment_no` 时，系统优先选择订单内最近创建且仍处于签发成功状态的证书。

## 请求示例

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
  "csr_mode": "original",
  "validation_method": "none"
}
```

### 使用请求头鉴权

```bash
curl -X POST "https://example.com/partner/ReissueCertificate/" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -d '{
    "order_no": "CERT202607041730001234",
    "cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
    "csr_mode": "original",
    "validation_method": "none"
  }'
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示提交成功。 |
| `message` | string | 响应消息。 |
| `data.order_no` | string | 合作商订单号。 |
| `data.source_cert_id` | string | 本次重签的源证书 ID。 |
| `data.cert_id` | string | 新建的重签证书 ID。后续查询状态和下载证书时应传此值。 |
| `data.cert_status` | integer | 新证书本地状态，提交成功时为 `2`（正在签发）。 |
| `data.cert_apply_status` | integer | 上游申请状态。 |
| `data.issue_round` | integer | 签发轮次，重签通常为 `2`。 |
| `data.verification_method` | string | 当前验证方式。 |
| `data.dcv` | object | 域名验证信息。异步生成时记录数组可能暂时为空。 |
| `data.dcv.method` | string | 验证方式。 |
| `data.dcv.records` | array | 所有域名的验证记录。 |
| `data.create_task` | object/null | 上游异步创建任务信息，YSSSL 等渠道可能返回。 |
| `data.request_id` | string | 请求 ID，可用于管理员检索签发日志。 |

## 响应示例

```json
{
  "code": 200,
  "message": "重新签发申请已提交，新证书记录已创建",
  "data": {
    "order_no": "CERT202607041730001234",
    "source_cert_id": "4a1d9f70-1d53-4f70-8f4f-1d9f701d5333",
    "cert_id": "5b2e0a81-2e64-4e81-9f5a-2e0a812e6444",
    "cert_status": 2,
    "cert_apply_status": 2,
    "issue_round": 2,
    "verification_method": "dns",
    "dcv": {
      "method": "dns",
      "records": [
        {
          "domain": "example.com",
          "type": "CNAME",
          "host": "_dnsauth",
          "value": "validation.example.ssl.com",
          "verified": false
        }
      ]
    },
    "create_task": {
      "status": 1,
      "status_text": "执行中",
      "latest_progress": {
        "progress": 50,
        "status": "running",
        "message": "生成验证信息"
      }
    },
    "request_id": "SIG-202607131200000000-ABC123"
  }
}
```

## 后续查询

重签成功提交后，请将响应中的 `data.cert_id` 传给获取订单状态接口：

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "order_no": "CERT202607041730001234",
  "cert_id": "5b2e0a81-2e64-4e81-9f5a-2e0a812e6444"
}
```

替换证书签发成功且证书内容保存完成后，系统才会将源证书标记为已吊销。下载新证书时也应向下载证书接口传入新的 `cert_id`。

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、源证书未签发、产品不支持重签、缺少上游订单号、CSR/私钥不完整或上游拒绝重签。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单或证书不存在，或不属于当前 API Key 对应用户。 |
| `405` | 请求方式错误。 |
| `409` | 当前证书已有重签申请正在处理。 |
| `500` | 服务器错误。 |

## 注意事项

- 只有签发成功状态的证书可以重签，且对应产品的 `supports_reissue` 必须为 `true`。
- YSSSL 重签固定沿用原订单的 CSR、私钥、域名、验证方式和联系人信息。即使传入其他 `csr_mode`，系统也会按 `original` 处理。
- YSSSL 提交重签后，系统会调用订单详情接口获取异步任务进度和 DCV 信息。
- 同一源证书存在待处理重签记录时不能重复提交。
- 源证书在替换证书签发完成前仍保持可用；替换证书签发并保存成功后才会停用源证书。
- 上游产品是否真正支持重签仍由对应 CA 决定。

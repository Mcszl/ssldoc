# 获取账号信息接口

合作商可通过 API 密钥获取当前密钥对应用户的账号基础信息、账户余额和受信余额。

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/GetUserData/index.php` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也兼容仅传 `api_secret`。 |

也可以使用请求头传入：

| Header | 说明 |
| --- | --- |
| `X-API-Key` | 与 `apikey` 参数含义相同。 |
| `Authorization` | 支持 `Bearer {apikey}`。 |

## 请求示例

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.user` | object | 用户基础信息。 |
| `data.account` | object | 用户账户余额信息。 |
| `data.api_key` | object | 本次鉴权使用的 API Key 信息，不包含 Secret。 |
| `data.server_time` | string | 服务器响应时间。 |

### 用户基础信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer | 用户自增 ID。 |
| `user_id` | string | 用户业务 ID。 |
| `username` | string | 用户名。 |
| `status` | integer | 用户状态：`0` 已封禁，`1` 正常，`2` 等待邮箱核验，`3` 等待手机核验。 |
| `status_text` | string | 用户状态说明。 |
| `user_type` | string | 用户类型，如 `user`、`partner`、`admin`。 |
| `partner_level` | integer | 合作商等级。 |
| `bound_phone` | string/null | 用户绑定手机号。 |
| `bound_email` | string/null | 用户绑定邮箱。 |

### 账户信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `balance` | number | 用户账户余额。 |
| `credit_line` | number | 受信额度。 |
| `credit_used` | number | 已使用受信额度。 |
| `credit_available` | number | 可用受信额度。 |
| `trusted_balance` | number | 受信余额，同 `credit_available`。 |
| `total_available` | number | 可用总额，等于账户余额加可用受信额度。 |

### API Key 信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `app_id` | string/null | API Key 的 AppID。 |
| `last_used_ip` | string/null | 本次调用来源 IP。 |

## 响应示例

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "user": {
      "id": 1,
      "user_id": "1",
      "username": "partner",
      "status": 1,
      "status_text": "正常",
      "user_type": "partner",
      "partner_level": 1,
      "bound_phone": "18600000000",
      "bound_email": "partner@example.com"
    },
    "account": {
      "balance": 1000,
      "credit_line": 500,
      "credit_used": 100,
      "credit_available": 400,
      "trusted_balance": 400,
      "total_available": 1400
    },
    "api_key": {
      "app_id": "ak_xxxxxxxxxxxxxxxxxxxxxxxx",
      "last_used_ip": "203.0.113.10"
    },
    "server_time": "2026-07-04 14:30:00"
  }
}
```

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 请求参数错误，或缺少 `apikey`。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

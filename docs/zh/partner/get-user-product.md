# 获取产品信息接口

合作商可通过 API 密钥查询当前系统中可售产品信息，并按域名类型、品牌代码、验证类型、产品名称、产品代码进行筛选。

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/GetUserProduct/index.php` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也兼容仅传 `api_secret`。 |
| `domain_type` | string | 否 | 域名类型，支持传类型代码或名称，如 `single`、`wildcard`、`单域名`。 |
| `brand_code` | string | 否 | 品牌代码，如 `digicert`、`certum`、`cnssl`。 |
| `verification_type` | string | 否 | 验证类型，支持传验证代码或名称，如 `dv`、`ov`、`ev`、`域名验证`。 |
| `product_name` | string | 否 | 产品名称，支持模糊查询。 |
| `product_code` | string | 否 | 产品代码，精确匹配。 |
| `page` | integer | 否 | 页码，默认 `1`。仅在传入 `limit` 时用于分页。 |
| `limit` | integer | 否 | 每页数量。未传或为空时返回全部匹配产品；传入时最大 `500`。 |

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
| `data.total` | integer | 符合条件的产品总数。 |
| `data.page` | integer | 当前页码。 |
| `data.limit` | integer | 本次返回数量限制。未传 `limit` 时等于全部匹配产品数量。 |
| `data.total_pages` | integer | 总页数。 |
| `data.items` | array | 产品列表。 |

### 产品字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `product_name` | string | 产品名称。 |
| `product_code` | string | 产品代码。 |
| `product_type` | string | 产品类型名称，如 SSL 证书。 |
| `product_type_code` | string | 产品类型代码，如 `ssl`。 |
| `verification_type` | string | 验证类型名称。 |
| `verification_type_code` | string | 验证类型代码，如 `dv`、`ov`、`ev`。 |
| `domain_type` | string | 域名类型名称。 |
| `domain_type_code` | string | 域名类型代码。 |
| `brand` | string | 品牌名称。 |
| `brand_code` | string | 品牌代码。 |
| `signature_algorithms` | array | 支持的签名算法及对应加密强度。 |
| `hash_algorithms` | array | 支持的哈希算法。 |
| `valid_years` | array | 可选年限及对应价格。 |
| `base_price` | number | 当前用户的一年期基础价格。 |
| `san_price` | number | 额外单域名单价。 |
| `wildcard_price` | number | 额外通配符单价。 |
| `max_single_domains` | integer | 最大单域名数量。 |
| `max_domains` | integer | 最大域名数量，同 `max_single_domains`。 |
| `max_wildcards` | integer | 最大通配符数量。 |

### 签名算法字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `name` | string | 签名算法名称，如 `RSA`、`ECC`。 |
| `code` | string | 签名算法代码。 |
| `category` | string | 算法分类。 |
| `description` | string/null | 算法说明。 |
| `encryption_strengths` | array | 当前签名算法支持的加密强度。 |

### 年限价格字段

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `years` | number | 年限。 |
| `months` | integer | 月数。 |
| `price` | number | 对应价格。用户有专属时长价格时返回专属价格。 |
| `san_price` | number | 该年限对应的额外单域名单价。 |
| `wildcard_price` | number | 该年限对应的额外通配符单价。 |

## 响应示例

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "total": 1,
    "page": 1,
    "limit": 1,
    "total_pages": 1,
    "items": [
      {
        "product_name": "CNSSL DV SSL",
        "product_code": "cnssl-dv",
        "product_type": "SSL 证书",
        "product_type_code": "ssl",
        "verification_type": "域名验证",
        "verification_type_code": "dv",
        "brand": "CNSSL",
        "brand_code": "cnssl",
        "signature_algorithms": [
          {
            "name": "RSA",
            "code": "rsa",
            "encryption_strengths": [
              { "name": "RSA-2048", "code": "rsa-2048" }
            ]
          }
        ],
        "hash_algorithms": [
          { "name": "SHA-256", "code": "sha256" }
        ],
        "valid_years": [
          { "years": 1, "months": 12, "price": 98 }
        ],
        "max_single_domains": 1,
        "max_wildcards": 0
      }
    ]
  }
}
```

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 请求参数错误。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

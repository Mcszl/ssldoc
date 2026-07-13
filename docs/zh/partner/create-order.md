# 创建订单接口

合作商可通过 API 密钥创建证书订单。接口会完成产品校验、域名校验、价格计算、账户扣款，并创建证书订单与第一期证书记录。

::: warning 扣款说明
调用成功后会立即从账户余额或受信额度中扣款。请在提交前确认产品、域名、年限和支付方式。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/CreateOrder/` |
| 请求方式 | `POST` |
| Content-Type | `application/json` 或 `application/x-www-form-urlencoded` |

## 必要参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 是 | API 密钥。推荐传 `app_id:api_secret`，也支持通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 传入。 |
| `product_code` | string | 与 `product_id` 二选一 | 产品代码，可通过“获取产品信息接口”获取。 |
| `product_id` | integer | 与 `product_code` 二选一 | 产品 ID。 |
| `domain` | string | 是 | 主域名。也兼容 `main_domain`。 |

## 条件必填参数

| 参数 | 类型 | 必填场景 | 说明 |
| --- | --- | --- | --- |
| `company_id` | integer | OV / EV 产品，与 `company_info` 二选一 | 已保存的企业信息 ID。传入时优先使用该企业信息。 |
| `company_info` | object | OV / EV 产品，与 `company_id` 二选一 | 直接传入企业信息，不会写入企业信息库，会随证书订单保存。 |
| `san_domains` | array | 多域名单域名 / 多域名混合产品需要额外单域名时 | 附加单域名列表。 |
| `wildcard_domains` | array | 多通配符 / 多域名混合产品需要额外通配符时 | 附加通配符域名列表。也兼容 `wc_domains`。 |
| `custom_csr` | string | 使用自定义 CSR 时 | PEM 格式 CSR。传入后接口会校验 CN、SAN、组织信息和算法。 |

## 直接传企业信息

OV / EV 产品必须提供企业信息。如果不使用 `company_id`，请在请求体中传入 `company_info` 对象。`company_info` 不会写入企业信息库，只会随本次订单保存并用于后续证书签发。

最小必填示例：

```json
{
  "company_info": {
    "company_name": "Example Technology Co., Ltd.",
    "country_code": "CN",
    "contact_first": "San",
    "contact_last": "Zhang",
    "email": "admin@example.com"
  }
}
```

`company_info` 也兼容使用 `company` 对象或同名顶层字段传入，但推荐统一使用 `company_info`。

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `company_name` | string | 是 | 公司全称。使用自定义 CSR 时，CSR 中的组织名称需与该值一致。 |
| `country_code` | string | 是 | 国家/地区两位代码，如 `CN`、`US`、`GB`。 |
| `contact_first` | string | 是 | 联系人姓。 |
| `contact_last` | string | 是 | 联系人名。 |
| `email` | string | 是 | 联系人邮箱。 |
| `registration_no` | string | 否 | 公司注册号或营业执照编号。也兼容 `registration_number`。 |
| `country_name` | string | 否 | 国家/地区名称。 |
| `province_pinyin` | string | 否 | 省/州拼音或英文名称。也兼容 `province`。 |
| `city_pinyin` | string | 否 | 城市拼音或英文名称。也兼容 `city`。 |
| `address` | string | 否 | 公司详细地址。 |
| `postal_code` | string | 否 | 邮政编码。 |
| `phone` | string | 否 | 公司或联系人电话。 |
| `contact_title` | string | 否 | 联系人职位。 |
| `id_number` | string | 否 | 联系人证件编号。 |

## 可选参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `months` | integer | `12` | 购买时长，单位月。优先级高于 `years`。 |
| `years` | integer | `1` | 购买年限。未传 `months` 时使用。 |
| `signature_algorithm` | string | `rsa` | 签名算法，如 `rsa`、`ecc`、`sm2`。也兼容 `sig_algos` 数组。 |
| `key_spec` | string | 根据签名算法自动选择 | 密钥规格，如 `rsa-2048`、`p-256`。也兼容 `key_specs` 数组。 |
| `hash_algorithm` | string | `sha256` | 哈希算法，如 `sha256`、`sha384`。也兼容 `hash_algos` 数组。 |
| `verification_method` | string | 产品允许范围内默认方式 | 域名验证方式，如 `dns`、`file`、`email-admin`。也兼容 `verif_methods` 数组。 |
| `payment_method` | string | `balance` | 支付方式：`balance` 余额支付，`credit` 受信额度支付。不能混合支付。 |
| `coupon_type` | string | 无 | 优惠类型：`coupon` 或 `code`。 |
| `coupon_id` | integer | 无 | 优惠券 ID。 |
| `coupon_code` | string | 无 | 优惠码。 |

## 域名类型规则

| 产品域名类型 | 主域名 / 附加域名要求 |
| --- | --- |
| `single` | 仅支持一个普通单域名，不能传 `san_domains` 和 `wildcard_domains`。 |
| `wildcard` | 主域名必须是 `*.example.com` 格式，不能传额外域名。 |
| `multiple-single` | 主域名和 `san_domains` 必须是普通单域名，不支持通配符。 |
| `multiple-wildcard` | 主域名和 `wildcard_domains` 必须是通配符域名。 |
| `multiple-mix` | 支持普通单域名和通配符域名混合。 |
| `ipv4` | 主域名字段填写 IPv4 地址，不能传额外域名。 |
| `ipv6` | 主域名字段填写 IPv6 地址，不能传额外域名。 |

## 请求示例

### 单域名 DV 证书

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "product_code": "cnssl-dv-single",
  "domain": "example.com",
  "months": 12,
  "verification_method": "dns",
  "payment_method": "balance"
}
```

### 多域名证书

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "product_code": "example-multi-domain",
  "domain": "example.com",
  "san_domains": ["www.example.com", "api.example.com"],
  "months": 12,
  "verification_method": "dns",
  "payment_method": "credit"
}
```

### OV / EV 证书

使用已保存的企业信息：

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "product_code": "example-ov-single",
  "domain": "example.com",
  "company_id": 12,
  "months": 12,
  "verification_method": "dns",
  "payment_method": "balance"
}
```

直接传入企业信息：

```json
{
  "apikey": "ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "product_code": "example-ov-single",
  "domain": "example.com",
  "company_info": {
    "company_name": "Example Technology Co., Ltd.",
    "registration_no": "91310000XXXXXXXXXX",
    "country_code": "CN",
    "province_pinyin": "Shanghai",
    "city_pinyin": "Shanghai",
    "address": "No. 1 Example Road",
    "postal_code": "200000",
    "phone": "+86.21.12345678",
    "contact_first": "San",
    "contact_last": "Zhang",
    "contact_title": "IT Manager",
    "email": "admin@example.com"
  },
  "months": 12,
  "verification_method": "dns",
  "payment_method": "balance"
}
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示成功。 |
| `message` | string | 响应消息。 |
| `data.order_no` | string | 订单号。 |
| `data.total_amount` | number | 订单原始应付金额。 |
| `data.discount_amount` | number | 优惠金额。 |
| `data.payable_amount` | number | 实际扣款金额。 |
| `data.unit_price` | number | 当前产品基础价格。 |
| `data.san_price` | number | 额外单域名单价。 |
| `data.wildcard_price` | number | 额外通配符单价。 |
| `data.extra_san_count` | integer | 计费的额外单域名数量。 |
| `data.extra_wc_count` | integer | 计费的额外通配符数量。 |
| `data.installments_count` | integer | 根据品牌许可天数拆分出的证书期数。 |
| `data.total_domains` | integer | 本订单域名总数。 |
| `data.years` | integer | 购买年限。 |
| `data.months` | integer | 购买月数。 |
| `data.payment_method` | string | 实际扣款方式。 |
| `data.deduct_amount` | number | 扣款金额。 |
| `data.is_custom_csr` | boolean | 是否使用了自定义 CSR。 |

## 响应示例

```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "order_no": "CERT202607041730001234",
    "total_amount": 98,
    "discount_amount": 0,
    "payable_amount": 98,
    "unit_price": 98,
    "san_price": 0,
    "wildcard_price": 0,
    "extra_san_count": 0,
    "extra_wc_count": 0,
    "installments_count": 2,
    "total_domains": 1,
    "years": 1,
    "months": 12,
    "payment_method": "balance",
    "deduct_amount": 98,
    "is_custom_csr": false
  }
}
```

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数错误、余额不足、受信额度不足、产品不支持所选域名/年限/算法等。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 产品不存在或已下架。 |
| `405` | 请求方式错误。 |
| `500` | 服务器错误。 |

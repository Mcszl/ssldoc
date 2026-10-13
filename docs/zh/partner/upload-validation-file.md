# 上传 OV/EV 验证文件接口

合作商可为正在签发的 CNSSL OV/EV 订单上传企业营业执照、法人身份证明、授权书或补充材料。文件信息保存在当前 API Key 对应的合作商账户中，并自动绑定到订单证书。

接口接收文件后会先写入安全暂存目录和合作商文件库，再由系统任务上传到该订单 OV/EV 类型对应的对象存储策略。文件进入对象存储后，系统任务会继续将其提交到 CNSSL。

::: warning 调用时机
请先调用“提交证书申请接口”。只有本地证书状态为 `2`（正在签发）且渠道为 CNSSL 的 OV/EV 订单可以上传验证文件。
:::

## 请求信息

| 项目 | 说明 |
| --- | --- |
| 请求地址 | `/partner/UploadValidationFile/` |
| 请求方式 | `POST` |
| Content-Type | `multipart/form-data` |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `apikey` | string | 否 | API 密钥。建议通过 `X-API-Key` 或 `Authorization: Bearer {apikey}` 请求头传入；未使用请求头时此字段必填。 |
| `order_no` | string | 是 | 创建订单接口返回的订单号。也兼容 `order_number`。 |
| `document_type` | string | 是 | CNSSL 文档类型，取值见下表。也兼容参数名 `type`。 |
| `file` | file | 是 | 单个验证文件。每次请求只能上传一个文件。 |

### 文档类型

| `document_type` | 说明 |
| --- | --- |
| `APPLICANT` | 法定代表人身份证正面、反面等身份证明材料。 |
| `ORGANIZATION` | 企业营业执照、登记证书等组织证明材料。 |
| `AUTHORIZATION` | 授权办理证书的授权文件。 |
| `ADDITIONAL` | 其他补充验证材料。 |

## 文件限制

- 支持 `PDF`、`JPG`、`JPEG`、`PNG`、`XADES`。
- 单个文件大小不能超过 5 MB，空文件不能上传。
- 每次请求只能上传一个文件；多个文件请分别调用接口。
- 验证文件类型由订单自动确定为 OV 或 EV，调用方不能自行指定。
- 对象存储策略由系统的 OV/EV 验证文件存储配置决定，调用方不能指定或覆盖。

## 请求示例

### 使用 X-API-Key

```bash
curl -X POST "https://example.com/partner/UploadValidationFile/" \
  -H "X-API-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -F "order_no=CERT202607041730001234" \
  -F "document_type=ORGANIZATION" \
  -F "file=@./business-license.pdf"
```

### 使用 Bearer 鉴权

```bash
curl -X POST "https://example.com/partner/UploadValidationFile/" \
  -H "Authorization: Bearer ak_xxxxxxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -F "order_no=CERT202607041730001234" \
  -F "document_type=APPLICANT" \
  -F "file=@./legal-representative.jpg"
```

## 响应参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `code` | integer | 业务状态码，`200` 表示接口已接收并保存文件。 |
| `message` | string | 响应消息。 |
| `data.order_no` | string | 合作商订单号。 |
| `data.certificate_id` | string | 文件绑定的证书 ID。 |
| `data.verification_type` | string | 订单验证类型，`OV` 或 `EV`。 |
| `data.duplicate` | boolean | 是否复用了当前合作商账户内 MD5 相同的文件。 |
| `data.file` | object | 合作商账户中的文件信息。 |
| `data.binding` | object | 文件与订单证书的绑定及上游提交状态。 |

### 文件信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer | 合作商账户文件 ID。 |
| `original_filename` | string | 原始文件名。 |
| `file_md5` | string | 文件 MD5。 |
| `file_size` | integer | 文件大小，单位为 Byte。 |
| `content_type` | string | 服务端识别的 MIME 类型。 |
| `file_extension` | string | 小写文件扩展名。 |
| `file_type` | string | 文件适用类型，`OV`、`EV` 或复用文件的 `COMMON`。 |
| `file_category_id` | integer | 系统验证文件分类 ID。 |
| `storage_profile_key` | string | 系统选中的对象存储策略标识，不包含访问凭据。 |
| `object_path` | string | 对象存储路径；等待上传时为预定路径。 |
| `status` | integer | 文件存储状态。 |
| `status_text` | string | 文件存储状态说明。 |
| `uploaded_at` | string/null | 接口接收文件的时间。 |

文件 `status` 取值：

| 值 | 说明 |
| --- | --- |
| `1` | 已上传至对象存储。 |
| `2` | 等待上传至对象存储。 |

### 绑定信息

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer | 文件绑定 ID。 |
| `document_type` | string | 提交到 CNSSL 的文档类型。 |
| `upstream_status` | integer | CNSSL 上传状态。 |
| `upstream_status_text` | string | CNSSL 上传状态说明。 |
| `upstream_uploaded_at` | string/null | 成功提交到 CNSSL 的时间。 |

`upstream_status` 取值：

| 值 | 说明 |
| --- | --- |
| `0` | 待上传。 |
| `1` | 上传中。 |
| `2` | 已上传。 |
| `3` | 上传失败，等待系统任务重试。 |

## 响应示例

```json
{
  "code": 200,
  "message": "验证文件已保存到合作商账户，等待上传至对象存储和上游",
  "data": {
    "order_no": "CERT202607041730001234",
    "certificate_id": "550e8400-e29b-41d4-a716-446655440000",
    "verification_type": "OV",
    "duplicate": false,
    "file": {
      "id": 108,
      "original_filename": "business-license.pdf",
      "file_md5": "93b885adfe0da089cdf634904fd59f71",
      "file_size": 245760,
      "content_type": "application/pdf",
      "file_extension": "pdf",
      "file_type": "OV",
      "file_category_id": 2,
      "storage_profile_key": "validation-documents",
      "object_path": "1024/files/93b885adfe0da089cdf634904fd59f71.pdf",
      "status": 2,
      "status_text": "等待上传至对象存储",
      "uploaded_at": "2026-10-13T15:28:30+08:00"
    },
    "binding": {
      "id": 86,
      "document_type": "ORGANIZATION",
      "upstream_status": 0,
      "upstream_status_text": "待上传",
      "upstream_uploaded_at": null
    }
  }
}
```

## 重复文件

系统按合作商账户、文件 MD5、订单验证类型和当前对象存储策略检查重复文件。同一账户在当前策略中已存在相同且适用于该订单的可用文件时，不会重复保存文件内容，而是复用原文件记录并绑定到当前订单，此时 `data.duplicate` 为 `true`。存储策略已经变更或文件不适用于当前订单类型时，系统会创建新的账户文件记录并上传到当前策略。

同一个文件已经绑定到同一订单时，重复请求是幂等的；如果再次请求的 `document_type` 与已有绑定不一致，接口返回 `400`，不会修改已上传或正在上传的文档类型。

## 错误码

| code | 说明 |
| --- | --- |
| `400` | 参数、文件格式或文件大小不符合要求；订单状态、渠道、存储策略或文件分类不可用。 |
| `401` | API 密钥无效。 |
| `403` | API 密钥关闭、吊销、过期，IP 不在白名单内，或账号被封禁。 |
| `404` | 订单不存在或不属于当前 API Key 对应的合作商账户。 |
| `405` | 请求方式错误。 |
| `500` | 服务器、暂存目录或数据库配置异常。 |

## 注意事项

- `code = 200` 表示文件已保存到账户并建立订单绑定，不表示文件已经提交到 CNSSL。
- 系统先执行对象存储上传任务，再执行 CNSSL 文档上传任务；两个阶段均为异步处理。
- `order_no`、文件记录与绑定记录都按 API Key 对应的合作商账户隔离，不能访问或复用其他账户的文件。
- 请勿在文件名中放置证件号码等敏感信息。系统会保留原始文件名用于上游提交。

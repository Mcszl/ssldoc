---
description: Complete SSL certificate domain control validation with DNS, CNAME, HTTP file, or email.
---

# Domain Validation

Domain control validation, often called DCV, proves to the CA that you control the domain in the certificate order.

## Methods

| Method | Best for | Notes |
| --- | --- | --- |
| DNS TXT | Most production websites | Stable and automation-friendly. |
| CNAME | Automated CA verification | Useful when the CA provides a CNAME target. |
| HTTP file | Simple web hosting | Requires public HTTP access to a specific file path. |
| Email | Legacy domain approval | Depends on mailbox availability. |

::: tip Recommended
Use DNS or CNAME validation when you want automated issuing, reissuing, and renewal.
:::

## DNS Checklist

1. Add the TXT or CNAME record exactly as shown in the order page.
2. Wait for DNS propagation.
3. Recheck the validation status in the console.
4. Do not delete the record until the certificate has been issued.

```bash
dig TXT _acme-challenge.example.com
dig CNAME _validation.example.com
```

::: warning
DNS providers may append the root domain automatically. If the console shows `_acme-challenge.example.com`, do not create `_acme-challenge.example.com.example.com`.
:::

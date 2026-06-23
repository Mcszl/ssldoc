---
description: Start using EveryoneTrust SSL to buy and issue your first SSL/TLS certificate.
---

# Getting Started

This guide walks through the normal certificate workflow in EveryoneTrust SSL.

## Workflow

| Step | What you do | Result |
| --- | --- | --- |
| 1 | Choose a certificate product | The product matches your domain type and validation level. |
| 2 | Submit an order | EveryoneTrust SSL creates the certificate request. |
| 3 | Complete domain validation | The CA confirms that you control the domain. |
| 4 | Deploy the certificate | Your website serves HTTPS with a valid certificate chain. |
| 5 | Monitor and renew | You avoid unexpected expiration. |

::: tip
If you manage DNS for the domain, configure DNS authorization first. It gives you the cleanest path for new issues and renewals.
:::

## Before You Order

- Confirm the primary domain, for example `example.com` or `*.example.com`.
- Decide whether you need single-domain, wildcard, SAN, OV, EV, or IP certificate support.
- Prepare a validation path: DNS/CNAME is recommended for automation.
- Keep the private key owner clear. If the platform generates the key, store it safely.

## Console Entry

Open the console and choose a certificate product:

```text
https://shop.ywxmz.com/console/
```

::: warning
Do not paste private keys into public tickets, chat rooms, or repositories.
:::

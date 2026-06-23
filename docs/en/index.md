---
description: EveryoneTrust SSL documentation for buying, applying for, validating, deploying, and automating SSL/TLS certificates.
layout: home

hero:
  name: EveryoneTrust SSL
  text: SSL/TLS certificate documentation
  tagline: Practical guides for certificate purchase, DCV validation, issuing, deployment, renewal, and automation.
  actions:
    - theme: brand
      text: Start Reading
      link: '#quick-start'
    - theme: alt
      text: Open Console
      link: https://shop.ywxmz.com/console/
    - theme: alt
      text: Certificate Pricing
      link: https://shop.ywxmz.com/price.html
  image:
    src: https://cos-ssldoc.ywxmz.com/spaceFiles/1/nS3DUXtiobRsMPxGnTNDzt.png
    alt: EveryoneTrust SSL

features:
  - icon: 🔐
    title: Certificate Lifecycle
    details: Learn how to choose products, place orders, complete validation, download certificates, and renew before expiry.
  - icon: 🌐
    title: Domain Validation
    details: Follow DNS, CNAME, HTTP file, and email validation flows with clear verification checkpoints.
  - icon: ⚙️
    title: Automation Ready
    details: Connect DNS authorization, certificate monitors, and deployment pipelines for repeatable HTTPS operations.
  - icon: 🧭
    title: Operations Playbooks
    details: Use concise checklists for Nginx, Apache, CDN, load balancer, and common troubleshooting scenarios.
---

## Quick Start {#quick-start}

Choose the path that matches what you are doing right now:

| Task | Guide |
| --- | --- |
| Buy a certificate | Select a product, fill in domain information, and submit the order in the console. |
| Validate domain ownership | Use DNS/CNAME validation when you want the most reliable automation path. |
| Install a certificate | Download the certificate chain and private key, then deploy them to your web server or CDN. |
| Keep certificates healthy | Enable certificate monitoring and configure renewal reminders or automated deployment. |

::: tip Recommended workflow
For most production websites, use DNS validation and connect DNS authorization before placing orders. This makes future issuance and renewal much smoother.
:::

## Example Deployment Notes

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /etc/nginx/ssl/example.com/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/example.com/private.key;
}
```

::: warning Keep the private key private
Never upload your private key to chat tools, tickets, public repositories, or unsupported third-party pages.
:::

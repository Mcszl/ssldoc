---
description: Deploy issued SSL/TLS certificates to Nginx, Apache, CDN, or load balancer services.
---

# Certificate Deployment

After issuance, deploy the certificate chain and private key to your HTTPS endpoint.

## Files

| File | Purpose |
| --- | --- |
| `fullchain.pem` | Server certificate plus intermediate certificates. |
| `private.key` | Private key paired with the certificate. |
| `ca_bundle.pem` | Intermediate CA chain if your platform requests it separately. |

## Nginx

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /etc/nginx/ssl/example.com/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/example.com/private.key;
}
```

## Apache

```apache
<VirtualHost *:443>
  ServerName example.com
  SSLEngine on
  SSLCertificateFile /etc/ssl/example.com/fullchain.pem
  SSLCertificateKeyFile /etc/ssl/example.com/private.key
</VirtualHost>
```

::: tip Verify after deployment
Use the certificate check tool after every deployment to confirm the chain, hostname, and expiration date.
:::

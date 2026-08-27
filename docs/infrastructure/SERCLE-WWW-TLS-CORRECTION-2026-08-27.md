# Sercle WWW TLS and canonical redirect correction

Program: SERCLE-PUBLIC-WEB-V1-POST-LAUNCH-WWW-TLS-AND-CANONICAL-REDIRECT-CORRECTION-001

## Before

- sercle.com resolved to 76.76.21.21 and served the accepted Sercle V1 production deployment.
- www.sercle.com was a GoDaddy-managed CNAME to sercle.com with a one-hour TTL.
- HTTPS traffic reached Vercel and redirected, but the served certificate contained only DNS:sercle.com; hostname validation for www.sercle.com failed.
- Vercel project sercle/sercle-home did not have www.sercle.com attached.

## Root cause

The www hostname reached Vercel but was not attached to the project, so Vercel could not provision a certificate for it. The missing project-domain attachment was the TLS blocker. The existing DNS target also differed from Vercel's fresh recommended target.

## Provider requirement and correction

- Vercel domain: www.sercle.com
- Behavior: permanent 308 redirect to sercle.com
- DNS type: CNAME
- DNS host: www
- Vercel target: a9430f9399cdfed6.vercel-dns-017.com.
- Verification: no additional TXT record required; Vercel validates the CNAME and manages certificate issuance/renewal.

The domain was attached to the existing sercle-home project as a redirect. Only the GoDaddy www CNAME value was changed, from sercle.com. to the target above. TTL remained one hour. Apex and child-platform records were not changed.

## Accepted result

- The certificate is trusted and has DNS:www.sercle.com in its SAN.
- https://www.sercle.com/<path>?<query> returns 308 to https://sercle.com/<path>?<query>.
- http://www.sercle.com/ upgrades to HTTPS, then redirects canonically.
- Canonical Sercle routes remain healthy and serve production source 12d22dbb0fc3d9b4d63f42cb38cf664c8f204cf1 / tree 71e872c36c56bba7bda7afe7bb0a5c3001f9fab5.

## Rollback

If reversal is required, change only the GoDaddy www CNAME value back to sercle.com. and remove only the www.sercle.com redirect domain from the Vercel project. This restores the prior state, including its known TLS hostname failure. Do not change the apex or child-platform records.

## Monitoring

The Public health GitHub Actions workflow runs twice hourly and on demand. It fails on canonical downtime, www TLS failure, redirect drift, lost path/query preservation, or a redirect loop.

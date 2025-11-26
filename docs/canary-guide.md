
# GAS Project – Canary Deployment Guide

## 1. What Is a Canary Deployment?

A **canary deployment** releases a new version of your application to a **small percentage of users first**, instead of all users at once.

This makes deployments safer by allowing you to:

✔ Test new versions in production
✔ Detect errors early
✔ Reduce the impact of failures
✔ Roll back instantly if the deployment is unstable

In the GAS Project, canary testing is done **locally** using a reverse proxy that splits traffic between:

* **Blue** = stable version
* **Green** = new canary version

---

## 2. How Canary Works in This Project

The setup uses a **Node.js reverse proxy** (`router.js`) inside Docker Compose.

The proxy forwards requests based on:

```bash
CANARY_PERCENT=
```

Example:

* 10 → 10% traffic goes to **green**
* 90 → 90% traffic goes to **green**
* 0 → no canary (all traffic goes to blue)
* 100 → full rollout

The selection is random per request, giving a realistic simulation.

---

## 3. Directory Components

```bash
/docker/router/router.js       <-- reverse proxy for canary routing
docker-compose.yml             <-- defines blue/green + proxy containers
src/                           <-- application code for both versions
```

The **same app code** is run twice:

* app-blue
* app-green

The router decides who gets the request.

---

## 4. How the Reverse Proxy Splits Traffic

### **router.js (logic summary)**

* Reads `CANARY_PERCENT` from environment
* Generates a random number (0–100)
* If the random number ≤ CANARY_PERCENT → route to **green**
* Else → route to **blue**

Example:

If `CANARY_PERCENT=20`:

* About **20%** of requests go to `app-green`
* About **80%** go to `app-blue`

---

## 5. How to Run a Canary Test Locally

### **Step 1 — Open `docker-compose.yml`**

Find:

```yaml
reverse-proxy:
  environment:
    - CANARY_PERCENT=20
```

Change the value to the % of traffic you want.

### **Step 2 — Start the system**

```bash
cd docker
docker-compose up --build
```

### **Step 3 — Send load to test routing**

#### **PowerShell version** (Windows)

```bash
1..100 | ForEach-Object { curl http://localhost:8090/items > $null }
```

#### **Linux/macOS**

```bash
for i in {1..100}; do curl -s http://localhost:8090/items > /dev/null; done
```

### **Step 4 — Check logs to see distribution**

```bash
docker logs app-blue
docker logs app-green
```

You’ll see request counts increase in each container.

---

## 6. Typical Canary Percentages

| Stage  | % to Green | Purpose                         |
| ------ | ---------- | ------------------------------- |
| Step 1 | **5%**     | Ensure new version works at all |
| Step 2 | **20%**    | Light load testing              |
| Step 3 | **50%**    | Half split performance check    |
| Step 4 | **100%**   | Full rollout (switch to green)  |

---

## 7. Monitoring the Canary

Use Prometheus and Grafana to track:

* Error rate
* Response time
* CPU & memory
* Request count differences

This helps you decide **when to increase canary traffic**.

---

## 8. Canary Workflow in GitHub Actions**

Your `canary.yml` currently contains a placeholder:

```yaml
name: Canary Promotion
on:
  workflow_dispatch:

jobs:
  canary:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Update router CANARY_PERCENT to shift traffic."
```

This represents future automation where the workflow will:

* Update traffic percentage dynamically
* Trigger metrics analysis
* Alert on failures

Right now, **your canary traffic is controlled manually via `docker-compose.yml`.**

---

## 9. Rolling Back the Canary

Rollback is fast and simple.

### To rollback locally

Set:

```bash
CANARY_PERCENT=0
```

Restart the proxy:

```bash
docker-compose restart reverse-proxy
```

Now all traffic goes to the stable **blue** version again.

No downtime.
Instant recovery.

---

## 10. Summary

The GAS Project implements canary deployment by:

✔ Running Blue + Green containers locally
✔ Using a Node.js reverse proxy to route traffic
✔ Adjusting traffic with a single environment variable
✔ Allowing real-time performance comparison
✔ Supporting instant rollback by setting canary to 0%

This provides a **realistic, production-grade deployment pattern** entirely from your laptop.

---

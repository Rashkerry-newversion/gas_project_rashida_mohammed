# GAS Project – Rollback Guide

## 1. What Is a Rollback?

A **rollback** is the process of returning the system to the **previous stable version** after a failed deployment.

In the GAS Project, rollback is:

* **Instant**
* **Zero-downtime**
* **Controlled by routing (Blue/Green architecture)**
* **Safe even during canary releases**

You always keep two versions running:

* **Blue** → Stable version
* **Green** → New version

A rollback simply means:
 *Switch all traffic back to Blue.*

---

## 2. Why Rollbacks Matter

Rollbacks protect your system from:

* Crashes
* Increased error rates
* Performance drops
* Unexpected bugs in new versions
* Regulatory or security issues

In the GAS Project, rollbacks are **local-first**, fast, and easy to simulate.

---

## 3. Rollback Mechanisms Used in This Project

You have two rollback layers:

---

## **A. Local Rollback using Reverse Proxy (Primary Method)**

Traffic is controlled by `CANARY_PERCENT` inside `docker-compose.yml`.

### When the new version (green) is failing

Set:

```bash
CANARY_PERCENT=0
```

* Then restart the proxy:

```bash
docker-compose restart reverse-proxy
```

This forces:

* **0% traffic → green**
* **100% traffic → blue**

Rollback complete.

✔ No downtime
✔ No need to stop containers
✔ No need to rebuild anything

---

## B. GitHub Actions Rollback Workflow (Placeholder Logic)

Workflow: `rollback.yml`

Current version:

```yaml
name: Rollback
on:
  workflow_dispatch:

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Placeholder for rollback logic: swap slots, redeploy previous image tag, or reduce canary traffic."
```

### Meaning

* Represents a *future* automated rollback.
* Will later connect to Azure App Service or another platform.
* Will allow one-click rollback from GitHub Actions.

Right now:
✔ It only echoes a message
✔ But the structure is correct for future implementation

---

## 4. When Should You Roll Back?

A rollback should be triggered when any of the following happen:

### **🔴 Health Checks Fail**

* `/health` returns `"status": "fail"`
* App stops responding
* High latency or timeouts

### **🔴 Bad Metrics**

From Prometheus or Grafana:

* Error rate increases
* CPU spikes
* Memory leaks
* Latency jumps

### **🔴 Canary Deployment Shows Degradation**

If 10–20% of traffic already shows failures:
→ Stop the rollout
→ Roll back to full blue

### **🔴 User Reports & Observability Alerts**

Any real-time issues reported should trigger rollback immediately.

---

## 5. Step-by-Step Rollback Procedure (LOCAL)

### **Step 1 — Detect Failure**

Check:

```bash
http://localhost:8090/health
http://localhost:8090/metrics
```

### **Step 2 — Update the Environment Variable**

In `docker-compose.yml`:

```yaml
CANARY_PERCENT=0
```

### **Step 3 — Restart the Reverse Proxy**

```bash
docker-compose restart reverse-proxy
```

### **Step 4 — Validate the Rollback**

```bash
curl http://localhost:8090/health
```

Check logs:

```bash
docker logs app-blue
docker logs app-green
```

Only **blue** logs should increase.

Rollback done.

---

## 6. Step-by-Step Rollback Procedure (GitHub Actions)

For presentation purposes, even though logic is placeholder today:

### **Step 1 — Trigger the workflow**

In GitHub:

➡ Actions → Rollback → Run workflow

### **Step 2 — Automated rollback would:**

`*(Once implemented in the future)*`

* Move traffic back to production slot
* Reset canary routing
* Restore environment variables
* Redeploy previous version
* Validate health and metrics

Currently, it just prints:

```bash
"Rollback logic placeholder"
```

Which is fine for now since **the real rollback happens locally**.

---

## 7. Rollback Validation Checklist

After rollback, confirm:

✔ `/health` endpoint returns `"ok"`
✔ `/metrics` error rate is low
✔ Logs show traffic going only to blue
✔ CPU/memory stabilized
✔ Grafana graphs return to normal

If all these checks pass → rollback is successful.

---

## 8. Summary

Rollback in the GAS Project is:

✔ Fast (one-line change)

✔ Safe (Blue/Green architecture)

✔ Zero-downtime

✔ Fully observable

### Current Implementation

* **Local rollback is 100% functional** using routing
* **GitHub rollback workflow exists** but is placeholder for future cloud integration

---

# **GAS Project – Blue/Green Deployment Guide**

## 1. Introduction

Blue/Green deployment is a **zero-downtime deployment strategy** that allows you to safely release new versions of your application by running two identical environments side-by-side:

* **Blue** → Current stable version
* **Green** → New version being tested

The router (reverse-proxy) controls which version receives traffic.
This approach eliminates downtime and makes rollback instant.

---

## 2. Why Blue/Green Deployment?

### ✔ No downtime

The new version (Green) is started fully before switching traffic.

### ✔ Easy rollback

If issues appear, switch traffic back to Blue instantly.

### ✔ Safe testing

Green can be validated using health checks and metrics before receiving traffic.

### ✔ Perfect for production systems

Minimizes risk for critical applications.

---

## 3. Architecture Overview

```bash
                        Incoming Requests
                                │
                                ▼
                    ┌────────────────────┐
                    │  Reverse Proxy     │
                    │ (Traffic Router)   │
                    └───────┬────────────┘
                            │
             ┌──────────────┴──────────────┐
             │                               │
  ┌───────────────────┐            ┌───────────────────┐
  │     BLUE APP      │            │     GREEN APP     │
  │ (Stable Version)  │            │  (New Release)    │
  └───────────────────┘            └───────────────────┘
```

---

## 4. How It Works in the GAS Project

### **Blue Environment**

* Runs on **port 3001**
* Represents your current stable application

### **Green Environment**

* Runs on **port 3002**
* Contains the new release candidate

### **Traffic Management**

* All external traffic flows through the **reverse-proxy**
* Traffic is pointed to Blue or Green based on the deployment stage

---

## **5. Blue/Green Lifecycle Stages**

### ### **Stage 1 — Build & Start Both Environments**

Using Docker Compose:

```bash
docker-compose up --build
```

This launches:

* `app-blue`
* `app-green`
* `reverse-proxy`
* Monitoring stack

### **Stage 2 — Verify Green (Pre-Switch Checks)**

Before sending traffic to Green:

* Check health

```bash
http://localhost:3002/health
```

* Check logs

```bash
docker logs app-green
```

* Check metrics

```bash
http://localhost:3002/metrics
```

### **Stage 3 — Switch Traffic**

Edit the reverse-proxy config **or** use environment variables to point all traffic to Green:

```bash
BLUE_WEIGHT=0
GREEN_WEIGHT=100
```

Or in simple mode:

```bash
CANARY_PERCENT=100
```

### Stage 4 — Monitor Green

Use Prometheus & Grafana to validate:

* Error rates
* Response time
* CPU/MEM usage
* Request counts

If performance is good → promote Green.

### Stage 5 — Complete the Switch

Green becomes the new **Blue** (stable version).
Optional: tear down the old Blue container.

### Stage 6 — Rollback If Needed

If metrics degrade:

* Switch traffic back to Blue immediately
* Rollback workflow automatically redeploys the last known good image

---

## 6. Router Configuration for Blue/Green

Reverse-proxy configuration (Docker Compose):

```yaml
reverse-proxy:
  image: node:18-alpine
  container_name: router
  working_dir: /app
  volumes:
    - ./router:/app
  command: ["node", "router.js"]
  ports:
    - "8090:3000"
  environment:
    - CANARY_PERCENT=0   # 0% Green = 100% Blue
```

To switch completely to Green:

```bash
CANARY_PERCENT=100
```

---

## 7. Monitoring Blue/Green Switch

### **Prometheus Targets**

* `app-blue`
* `app-green`
* `router`

### **Grafana Dashboards Should Show**

* Requests per version
* Latency differences
* Error rates
* CPU/MEM usage
* Event loop performance

Monitoring ensures the new Green version behaves well before full release.

---

## 8. When to Use Blue/Green

✔ Critical production releases
✔ Large system changes
✔ Major backend restructuring
✔ New features that carry risk
✔ When rollback must be instant

---

## 9. When NOT to Use Blue/Green

✘ Extremely database-heavy updates
✘ Apps with very large stateful sessions
✘ Systems lacking monitoring or health checks

---

## 10. Summary

Blue/Green deployment allows the GAS Project to:

* Deploy new features **without downtime**
* Safely test new builds in parallel
* Instantly revert to the stable version (rollback)
* Validate performance with metrics before release
* Integrate easily with Canary and CI/CD workflows

This strategy ensures **confidence, safety, and reliability** in every release.

---

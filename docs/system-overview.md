# GAS Project – System Overview

## **1. Introduction**

This GAS Project is a full DevOps simulation designed to demonstrate end-to-end software delivery using modern best practices.
The system includes:

* A Node.js CRUD API
* Dockerized application environments
* Blue/Green and Canary deployment strategies
* GitHub Actions CI/CD pipelines
* Local observability with Prometheus & Grafana
* Azure-ready infrastructure scripts

This overview explains how all components fit together as a complete deployment ecosystem.

---

## **2. High-Level Architecture**

```bash
                   ┌────────────────────┐
                   │   User / Client    │
                   └─────────┬──────────┘
                             │
                             ▼
                   ┌────────────────────┐
                   │   Reverse Proxy    │
                   │ (Traffic Router)   │
                   └─────────┬──────────┘
               Blue Route    │     Green Route
               (Stable)      │     (Canary)
                             │
       ┌─────────────────────┴─────────────────────┐
       │                                           │
┌───────────────┐                         ┌────────────────┐
│   App-Blue     │                         │   App-Green    │
│ (Stable Build) │                         │ (New Version)  │
└───────────────┘                         └────────────────┘
       │                                           │
       └──────────────────────┬────────────────────┘
                              ▼
                   ┌────────────────────┐
                   │   Prometheus       │
                   │ Metrics Collector  │
                   └─────────┬──────────┘
                             ▼
                   ┌────────────────────┐
                   │     Grafana        │
                   │   Dashboards       │
                   └────────────────────┘
```

---

## 3. Components

### 3.1 Application Layer

#### Node.js CRUD API

* Exposes `/items`, `/health`, and `/metrics`
* Logs to stdout for container compatibility
* Bundled with unit tests and linting rules

---

### 3.2 Reverse Proxy (Traffic Router)

Responsible for:

* Routing all traffic to either Blue or Green
* Handling Canary percentage via `CANARY_PERCENT`
* Acting as the control point for deployment strategies

---

### 3.3 Blue/Green Environments

Two independent builds of the same application:

| Environment | Purpose                      |
| ----------- | ---------------------------- |
| **Blue**    | Stable production-like build |
| **Green**   | New version being tested     |

This enables safe rollouts without downtime.

---

### 3.4 Canary Deployment Logic

The router splits traffic between versions:

```bash
CANARY_PERCENT=20 → 20% Green, 80% Blue
```

This allows testing real traffic before full promotion.

---

### 3.5 Observability Stack

#### Prometheus

Scrapes metrics from:

* App-Blue
* App-Green
* Reverse proxy

#### **Grafana**

Visualizes:

* Request rates
* Latency
* CPU & memory usage
* Canary behavior
* Error spikes

---

## 4. CI/CD Pipeline (GitHub Actions)

The project includes 5 key workflows:

1. **ci.yml** – Build, lint, test, and validate
2. **cd-staging.yml** – Deploy to staging
3. **cd-production.yml** – Approvals + deploy to production
4. **canary.yml** – Adjust traffic for canary rollout
5. **rollback.yml** – Restore previous version or reduce canary traffic

All workflows can be tested locally using:

```bash
act -j build-and-test
```

---

## 5. Local Development Workflow

### Step 1: Run the full environment

```bash
docker-compose up --build
```

### **Step 2: Access the system**

* Router: **[http://localhost:8090](http://localhost:8090)**
* App-Blue: **[http://localhost:3001](http://localhost:3001)**
* App-Green: **[http://localhost:3002](http://localhost:3002)**
* Prometheus: **[http://localhost:9090](http://localhost:9090)**
* Grafana: **[http://localhost:3005](http://localhost:3005)**

### Step 3: Test canary traffic

```bash
curl http://localhost:8090/items
```

---

## 6. Deployment Strategies

### 6.1 Blue/Green Deployment

Switch 100% of traffic from Blue → Green only when metrics are healthy.

### 6.2 Canary Deployment

Gradually increase Green traffic:

```bash
10% → 30% → 50% → 100%
```

If performance drops:
→ immediate rollback to full Blue.

---

## 7. Rollback Strategy

Rollback can be triggered by:

* Failed health checks
* Metrics degradation
* Deployment errors
* Manual override

Rollback workflow swaps traffic or redeploys the last stable image.

---

## 8. Summary

The GAS Project combines real DevOps concepts into one system:

✔ Continuous Integration
✔ Continuous Delivery
✔ Safe deployment strategies
✔ Observability
✔ Traffic management
✔ Modern containerized architecture
✔ Local-first validation

It provides a full, production-style deployment lifecycle that can run entirely on a developer’s machine.

---

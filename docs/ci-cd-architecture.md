# GAS Project – CI/CD Architecture

---

## 1. Purpose of the CI/CD System

The CI/CD setup in the GAS Project ensures that:

* Every code change is automatically validated
* Linting, testing, and builds run before merging
* Staging, production, canary, and rollback workflows exist as a **future-ready structure**
* Developers can run workflows locally using `act`
* The architecture prepares the project for cloud deployment later

It is designed to be:

✔ **Local-first**
✔ **Developer-friendly**
✔ **Cloud-ready**

---

## **2. High-Level CI/CD Pipeline Flow (No Docker Version)**

```bash
Developer Pushes Code
        │
        ▼
┌─────────────────────────────────┐
│      Continuous Integration     │
│           (ci.yml)              │
├─────────────────────────────────┤
│ • Install dependencies          │
│ • Lint code                     │
│ • Run tests                     │
│ • Build the application         │
└───────────────┬─────────────────┘
                │  CI PASSES ✔
                ▼
      ┌───────────────────────────┐
      │     Staging Workflow      │
      │     (cd-staging.yml)      │
      └───────────┬──────────────┘
                  │
                  ▼
    Placeholder staging deployment
                  │
                  ▼
     ┌────────────────────────────┐
     │   Production Workflow      │
     │   (cd-production.yml)      │
     └─────────────┬─────────────┘
                   │
        Manual Approval Required
                   ▼
         Placeholder production deploy
                   │
                   ▼
   ┌────────────────────────────────┐
   │      Canary Workflow          │
   │        (canary.yml)           │
   └───────┬────────────────────────┘
           │
   Adjust canary % + monitor
           │
           ├── Healthy → Continue rollout
           └── Unhealthy → Trigger rollback

                     ▼
          ┌────────────────────┐
          │   Rollback Flow    │
          │   (rollback.yml)   │
          └────────────────────┘
```

---

## 3. Continuous Integration (ci.yml)

The CI pipeline performs exactly the following:

### **Triggers**

* Push to `main`
* Pull request to `main`

### **What It Does**

1. **Checkout code**
2. **Install Node 18**
3. **Install dependencies (`npm ci`)**
4. **Run ESLint (`npm run lint`)**
5. **Run tests (`npm test`)**
6. **Build project (`npm run build`)**

### **Purpose**

Ensures code quality and prevents breaking changes before merging.

---

## 4. CD – Staging Workflow (cd-staging.yml)

This workflow is currently a placeholder.

### **What the placeholder represents**

* A future deployment to staging
* Running smoke tests
* Validating the build before production

### **Current Status**

🚫 *No real deployment logic yet*

---

## 5. CD – Production Workflow (cd-production.yml)

Also a placeholder.

### Intended purpose (Production)

* Manual approval
* Deploy to production environment
* Perform health checks
* Prepare for rollback

### Current State

🚫 *Outputs placeholder “deployment coming soon” message*

---

## 6. Canary Workflow (canary.yml)

Placeholder for future controlled releases.

### Intended purpose (Canary)

* Gradually release to a small % of users
* Increase traffic over time (10%, 20%, 50%…)
* Monitor using Prometheus & Grafana
* Roll back automatically if unstable

### Current State (Canary)

🚫 *No real traffic-shifting logic inside GitHub Actions*
(Your canary routing currently happens *locally* using the reverse-proxy.)

---

## **7. Rollback Workflow (rollback.yml)**

A simple placeholder.

### Intended purpose (Rollback)

* Switch traffic back to safe version
* Undo failed changes
* Validate system health

### Current State (Rollback)

🚫 *Echo-only implementation*

---

## **8. Local CI/CD Testing with `act`**

You can run your whole CI/CD pipeline locally:

```bash
act -j build-and-test
act -j deploy-staging
act -j deploy-prod
act -j canary
act -j rollback
```

### **Why this is important**

* Faster feedback than GitHub Actions
* All workflows can be validated before pushing
* Zero-cost testing

---

## **9. Summary**

The GAS Project CI/CD system is currently:

### ✔ **Accurately implemented**

* Linting
* Testing
* Building
* Local workflow execution

### ✔ **Cloud-ready**

* Staging, Production, Canary, and Rollback workflows exist
* Ready for Azure or AWS integration later

### ✔ **Safe**

* Manual approvals
* Separation of environments

### ✔ **Developer-friendly**

* Everything can run locally
* No Docker complexity yet

---

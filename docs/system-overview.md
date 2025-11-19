# System Overview

This repository demonstrates a local-first deployment pipeline including:
- Node.js API app exposing /health and /metrics
- Blue/Green simulation with two containers (app-blue, app-green)
- Canary routing via a simple router that proxies and controls traffic percentage
- Prometheus and Grafana local observability
- GitHub Actions CI template

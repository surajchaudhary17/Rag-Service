# Rag-Service
SharePoint-based RAG + LLM platform
Phase 1 — Foundation
Building of automated SharePoint ingestion pipeline in Java/Spring Boot using Microsoft Graph API, Apache Tika for multi-format parsing, and Qdrant vector DB — processing 5,000+ document chunks with idempotent incremental sync.

Phase 2 — RAG query engine + API
Engineered RAG query engine with Spring AI — embedding user queries, semantic retrieval from vector store, prompt construction, and streaming LLM responses via SSE. Implemented Redis sliding-window rate limiting using Redisson to protect the API under load.

Phase 3 — Kubernetes + CI/CD
Containerised and deployed the platform on Kubernetes (minikube/GKE) with Helm charts — including HPA autoscaling, StatefulSets for Redis and Qdrant with PVCs, and a GitHub Actions CI/CD pipeline automating build-test-push-deploy on every merge to main.

Phase 4 — Polish + observability
Added production observability with Prometheus/Grafana dashboards tracking P95 RAG latency and token usage. Achieved 85% unit test coverage using JUnit 5 + Testcontainers. Validated autoscaling under load with k6 load tests.

# ─────────────────────────────────────────────────────────────────────────────
#  VulnLab – Dockerfile
#  INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
#  All vulnerabilities are SIMULATED (static responses only).
#  No real RCE, no real file access, no external network reach.
# ─────────────────────────────────────────────────────────────────────────────

FROM python:3.12-slim

# --- Labels ---------------------------------------------------------------
LABEL maintainer="VulnLab <edu@vulnlab.local>"
LABEL description="INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY"
LABEL version="1.0.0"

# --- Create a non-root user (defence-in-depth even in a vuln lab) ---------
RUN groupadd --gid 1001 appgroup && \
    useradd  --uid 1001 --gid appgroup --no-create-home --shell /sbin/nologin appuser

# --- Working directory -------------------------------------------------------
WORKDIR /app

# --- Install dependencies (as root, then drop) --------------------------------
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Copy application source --------------------------------------------------
COPY app/ .

# --- Switch to non-root -------------------------------------------------------
USER appuser

# --- Expose port (mapped to 127.0.0.1:8080 by docker-compose) ---------------
EXPOSE 8080

# --- Health check -------------------------------------------------------------
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

# --- Start via Gunicorn (no --reload in prod, 2 workers is plenty) -----------
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "30", "app:app"]

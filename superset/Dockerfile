FROM apache/superset:1.0.0

USER root

COPY ./hack/chinacity.geojson /app/superset/static/assets/4ab8111fffd72a0f1789eb9a5364b9e8.geojson

# Switching back to using the `superset` user
USER superset

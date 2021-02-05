FROM apache/superset:1.0.0

USER root

# hack city map
COPY ./hack/chinacity.geojson /app/superset/static/assets/4ab8111fffd72a0f1789eb9a5364b9e8.geojson
# hack chinese csv export
COPY ./hack/core.py /app/superset/views/core.py

# Switching back to using the `superset` user
USER superset

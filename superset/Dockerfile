ARG version=1.0.1

FROM apache/superset:${VERSION}

USER root

# hack city map
COPY ./hack/4ab8111fffd72a0f1789eb9a5364b9e8.geojson /app/superset/static/assets/4ab8111fffd72a0f1789eb9a5364b9e8.geojson
# hack chinese csv export
COPY ./hack/core.py /app/superset/views/core.py

RUN pip install psycopg2==2.8.5 redis==3.2.1

# Switching back to using the `superset` user
USER superset

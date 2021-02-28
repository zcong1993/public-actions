FROM golang:1.16-alpine AS builder

ARG VERSION="nightly"

RUN apk add --update git
RUN mkdir /nats-server-tmp && \
    cd /nats-server-tmp && \
    git clone https://github.com/nats-io/nats-server.git && \
    CGO_ENABLED=0 go build -v -ldflags "-s -w -X github.com/nats-io/nats-server/server.gitCommit=`git rev-parse --short HEAD`" -o /nats-server

RUN mkdir -p src/github.com/nats-io && \
    cd src/github.com/nats-io/ && \
    git clone https://github.com/nats-io/natscli.git && \
    cd natscli/nats && \
    go build -ldflags "-s -w -X main.version=${VERSION}" -o /nats

RUN go get github.com/nats-io/nsc

FROM alpine:latest

RUN apk add --update ca-certificates && mkdir -p /nats/bin && mkdir /nats/conf

COPY nats-server.conf /nats/conf/nats-server.conf
COPY --from=builder /nats-server /bin/nats-server
COPY --from=builder /nats /bin/nats
COPY --from=builder /go/bin/nsc /bin/nsc

EXPOSE 4222 8222 6222 5222

ENTRYPOINT ["/bin/nats-server"]
CMD ["-c", "/nats/conf/nats-server.conf"]
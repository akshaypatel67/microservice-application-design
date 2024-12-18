FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /scripts

COPY configure-kong.sh conf.sh

# Set execute permission:
RUN chmod +x conf.sh

# RUN apt-get update && apt-get install -y bash

CMD ["sh", "-c", "pwd && bash conf.sh"]
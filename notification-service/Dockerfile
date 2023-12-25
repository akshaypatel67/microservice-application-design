FROM php:7.4

RUN apt-get update && apt-get install -y \
    git \
    libc6-dev \
    libsasl2-dev \
    libsasl2-modules \
    libssl-dev

RUN git clone https://github.com/edenhill/librdkafka.git \
    && cd librdkafka \
    && ./configure \
    && make \
    && make install \
    && pecl install rdkafka \
    && docker-php-ext-enable rdkafka

# Uncomment if want to use thread in php
#
# RUN git clone https://github.com/krakjoe/pthreads.git \
#     && cd pthreads \
#     && phpize \
#     && ./configure \
#     && make \
#     && make install

RUN git clone https://github.com/PHPMailer/PHPMailer.git

WORKDIR /app

COPY . .

CMD php consumer.php

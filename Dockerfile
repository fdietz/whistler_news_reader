FROM elixir:1.2

MAINTAINER Frederik Dietz <fdietz@gmail.com>

RUN apt-get update -q && \
    apt-get -y install \
    apt-transport-https \
    curl \
    libpq-dev \
    postgresql-client \
    imagemagick \
    && apt-get clean -y && \
    rm -rf /var/cache/apt/*

RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo 'deb https://deb.nodesource.com/node_4.x jessie main' > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update -q && \
    apt-get install -y \
    nodejs \
    && apt-get clean -y && \
    rm -rf /var/cache/apt/*

RUN npm install -g npm@3.8.9

RUN mkdir /app
WORKDIR /app

ENV MIX_ENV prod
ENV NODE_ENV production

COPY mix.* ./
COPY config/* ./config/

RUN mix local.rebar
RUN mix local.hex --force
RUN mix deps.get --only prod
RUN mix deps.compile --only prod

COPY ./client ./client/
COPY ./lib ./lib/
COPY ./priv ./priv/
COPY ./web ./web/
RUN mix compile --only prod

COPY package.json /app/
RUN npm install

RUN mix phoenix.digest

EXPOSE 4000

CMD ["mix", "phoenix.server"]

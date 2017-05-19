FROM trenpixster/elixir:1.4.1

MAINTAINER Frederik Dietz <fdietz@gmail.com>

RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && apt-get install -y nodejs

RUN apt-get update -q && \
    apt-get -y install \
    apt-transport-https \
    imagemagick \
    && apt-get clean -y && \
    rm -rf /var/cache/apt/*

RUN mkdir /app
WORKDIR /app

ENV MIX_ENV prod

ADD mix.* ./
RUN mix local.rebar
RUN mix local.hex --force
RUN mix deps.get

ADD package.json ./
RUN npm install

ADD . .
RUN mix compile

RUN mix phoenix.digest

EXPOSE 4000

CMD ["mix", "phoenix.server"]

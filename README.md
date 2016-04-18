# whistler news reader
[![Build Status](https://travis-ci.org/fdietz/whistler_news_reader.svg?branch=master)](https://travis-ci.org/fdietz/whistler_news_reader)

A modern stylish RSS Reader with a beautiful reading experience.

![alt tag](https://raw.githubusercontent.com/fdietz/whistler_news_reader/master/screenshots/list.png)

![alt tag](https://raw.githubusercontent.com/fdietz/whistler_news_reader/master/screenshots/grid.png)

Also: My testbed for learning new technologies. Done in [Elixir](https://github.com/elixir-lang/elixir), [Phoenix Framework](https://github.com/phoenixframework/phoenix), [Webpack](https://github.com/webpack/webpack), [React](https://github.com/facebook/react) and [Redux](https://github.com/rackt/redux).

## Live Demo

<https://whistler-news-reader.herokuapp.com>

## Installation Instructions

To start your whistler news reader app:

  1. Install dependencies with `mix deps.get`
  2. Ensure npm packages with `npm install`
  3. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  4. Run seeds to create initial user `mix run priv/ecto/seeds.exs`
  3. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.


## Deployment
Have a look at the [deploy guide](https://github.com/fdietz/whistler_news_reader/blob/master/DEPLOY.md)

Additionally, please check out the official Phoenix Framework [deployment guides](http://www.phoenixframework.org/docs/deployment).

## License

See [License](https://github.com/fdietz/whistler_news_reader/blob/master/LICENSE)

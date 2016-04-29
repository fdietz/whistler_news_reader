# Heroku Deployment

Install the Heroku Toolbelt from here https://toolbelt.heroku.com/

First create our new project:

```
$ heroku create whistler_news_reader
```

The command will create our application on Heroku and add a git remote "heroku" repository that we can later use for the deployment.

## Buildpacks
We need two different buildpacks for the Phoenix application:
* https://github.com/HashNuke/heroku-buildpack-elixir
* https://github.com/gjaldon/heroku-buildpack-phoenix-static

Install both using `heroku buildpacks:add` command:

```
> heroku buildpacks:add https://github.com/HashNuke/heroku-buildpack-elixir
Buildpack added. Next release on whistler-news-reader will use https://github.com/HashNuke/heroku-buildpack-elixir.
```

```
> heroku buildpacks:add https://github.com/gjaldon/heroku-buildpack-phoenix-static
Buildpack added. Next release on whistler-news-reader will use:
  1. https://github.com/HashNuke/heroku-buildpack-elixir
  2. https://github.com/gjaldon/heroku-buildpack-phoenix-static
Run git push heroku master to create a new release using these buildpacks.
```

`elixir_buildpack.config` specifies the required elixir version. The `phoenix_static_buildpack.config` the `node` and `rpm` versions respectively.

Finally, there's the `compile` file (used by the phoenix static buildpack) which describes how to compile our assets after each deployment.

## Configuration

In `config/prod.ex` change the following:


```
-url: [host: "example.com", port: 80],

+url: [scheme: "https", host: "whistler_news_reader.herokuapp.com", port: 443],
+force_ssl: [rewrite_on: [:x_forwarded_proto]],
```

In `config/prod.secret.exs` change the following:
```
-username: System.get_env("DATABASE_USERNAME"),
-password: System.get_env("DATABASE_PASSWORD"),

+url: System.get_env("DATABASE_URL"),

+config :guardian, Guardian,
+  secret_key: System.get_env("GUARDIAN_SECRET_KEY")
```

The important take away is that we replace some settings with environment variables, as for example the `secret_key_base`, guardian `secret_key` or the database `url`. The later will be automatically set by Heroku, but we need to create the secret keys using the `mix phoenix.gen.secret` command.

Execute the following for the secret_key:
```
$ mix phoenix.gen.secret
xxxxxxxxxx
$ heroku config:set SECRET_KEY_BASE="xxxxxxxxxx"
```

And again for the guardian secret_key:

```
$ mix phoenix.gen.secret
xxxxxxxxxx
$ heroku config:set GUARDIAN_SECRET_KEY="xxxxxxxxxx"
```

And we should be ready deploy via:

```
git push heroku
```

After the successful deploy, we still have to setup the database.

Add the [Heroku Postgres Addon](https://elements.heroku.com/addons/heroku-postgresql):

```
heroku addons:create heroku-postgresql:hobby-dev
```

Now run the migrations:
```
$ heroku run mix ecto.migrate
```

# Credits
Thanks to others for getting started with this project:
* http://codeloveandboards.com/blog/2016/03/04/trello-tribute-with-phoenix-and-react-pt-12/
* http://www.phoenixframework.org/docs/heroku

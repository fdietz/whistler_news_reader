# Deployment

## Heroku Deployment

Install the Heroku Toolbelt from here https://toolbelt.heroku.com/

First create our new project:

```
$ heroku create whistler-news-reader
```

The command will create our application on Heroku and add a git remote "heroku" repository that we can later use for the deployment.

### Buildpacks
We need two different buildpacks for the Phoenix application:
* https://github.com/HashNuke/heroku-buildpack-elixir
* https://github.com/gjaldon/heroku-buildpack-phoenix-static

Install both using `heroku buildpacks:add` command:

```
$ heroku buildpacks:add https://github.com/HashNuke/heroku-buildpack-elixir
```

and 

```
$ heroku buildpacks:add https://github.com/gjaldon/heroku-buildpack-phoenix-static
```

`elixir_buildpack.config` specifies the required elixir version. The `phoenix_static_buildpack.config` the `node` and `rpm` versions respectively.

Finally, there's the `compile` file (used by the phoenix static buildpack) which describes how to compile our assets after each deployment.

### Configuration

In `config/prod.ex` and `config/prod.secret.exs` we use several environment variables
which must be set.

Let's start with the `URL_HOST` based on heroku app name:
```
$ heroku config:set URL_HOST="https://whistler-news-reader.herokuapp.com/"
```

And the `URL_PORT` accordingly:

```
$ heroku config:set URL_PORT=443
```

Execute the following for the `SECRET_KEY_BASE`:
```
$ mix phoenix.gen.secret
xxxxxxxxxx
$ heroku config:set SECRET_KEY_BASE="xxxxxxxxxx"
```

And again for the guardian `GUARDIAN_SECRET_KEY`:

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

# Docker

## Prerequisites
Install the docker toolbox https://www.docker.com/products/docker-toolbox.

## Setup docker machine

### Localhost

1. Create a docker machine locally

    ```bash
    $ docker-machine start default
    ```

2. Set the environment

    ```bash
    $ eval $(docker-machine env)
    ```

3. Now build the docker images

    ```bash
    $ POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres docker-composer up -d
    ```

4. Visit website

    ```bash
    $ open http://localhost:8080
    ```

### Cloud Provider/Hosting services


1. Create a docker machine:

    ```bash
    $ docker-machine create --driver digitalocean --digitalocean-access-token xxxxx --digitalocean-image ubuntu-16-04-x64 whistler
    ```

    Replace `xxxxx` with your token. See the documentation on how to generate
    your token:
    https://www.digitalocean.com/community/tutorials/how-to-provision-and-manage-remote-docker-hosts-with-docker-machine-on-ubuntu-16-04


2. Set the environment

    ```bash
    $ eval $(docker-machine env whistler)
    ```

3. Now build the docker images

    ```bash
    $ POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres docker-composer up -d
    ```

   In my experience it didn't work with the digitalocean base image because it has not enough RAM to build `erlang-idna`. See issue https://github.com/benoitc/erlang-idna/issues/8. Upgrading my droplet fixed it for me.

4. Check your IP address using docker-machine

    ```bash
    $ docker-machine ip whistler
    ```

5. Visit website

    ```bash
    $ open http://your-ip-adress:8080
    ```

### Create the database

Using `docker-composer exec` we can run commands inside the running container.

  ```bash
  $ POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres docker-compose exec web mix ecto.create
  ```

### Run migrations

  ```bash
  $ POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres docker-compose exec web mix ecto.migrate
  ```

### Restart

  ``` bash
  docker-compose restart web
  ```

### Build a new image

  ``` bash
  docker-compose stop web &&
  docker-compose rm web &&
  docker-compose up -d web
  ```

### Logging

  ``` bash
  docker-compose logs web
  ```

# Credits
Thanks to others for getting started with this project:
* http://codeloveandboards.com/blog/2016/03/04/trello-tribute-with-phoenix-and-react-pt-12/
* http://www.phoenixframework.org/docs/heroku

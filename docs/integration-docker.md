---
id: integration_docker
title: Docker
sidebar_label: Docker
---

<img src="https://www.docker.com/sites/default/files/d8/2019-07/Moby-logo.png" height=50 />

## Overview

ReNative has the ability to deploy your website made with `rnv` to Docker hub or export it to a Docker container.

The files are exported to `platformBuilds/xxxxx_web/export/docker`.

The app is served by an nginx server over HTTP and HTTPS using a self signed cert that's generated when the image is built. For the moment there is no support for custom certs or Let's Encrypt but they will be added in the future.

##### Structure

```
.
├── public - your app's resting place
│   ├── index.html
│   └── ...
├── docker-compose.build.yml - compose file used when you want to build the image (needs internet connection)
├── docker-compose.yml - compose file used when you import the tar
├── Dockerfile
├── nginx.default.conf - nginx's config used inside the container
└── {projectName}_{projectVersion}.tar - tar file used to import the image on a system without internet connection

```

The export contains 2 compose files. If you don't want to import the tar containing the built image you can rename the `docker-compose.build.yml` to `docker-compose.yml` and use that one with `docker-compose up -d`. Keep in mind that you need an internet connection in this case since it tries to pull the base image from DockerHub.

However, if you are just trying to test out the feature on the same machine that you ran `rnv export` or `rnv deploy` you can directly run `docker-compose up -d` without any changes because you already have the image with the correct tag in your docker instance.

## Commands

`rnv export -p web -t docker` - will build your project and create a docker image with an nginx server hosting it.

`rnv deploy -p web -t docker` - same as above but also publish it to DockerHub. It will tag the image with 2 tags, one is the app's version and one is `latest`. This way you will have a history of all the versions and a `latest` one.

## Advanced usage

#### Offline usage

On systems without internet connection or no access to DockerHub you can import the `.tar` file and run it, since the tar contains all the layers needed for the image.

1. `docker load --input xx.tar`
2. `docker-compose up -d`

**Always use the `docker-compose` file exported with `.tar` file, don't try to use an older version because it will not work. Every `docker-compose` file has the app's version hardcoded as the image tag.**

#### Healthcheck probe

You can also instruct `rnv` to add an empty healthcheck file into the container (`testprobe.html`) that you can ping with your load balancer.

You can do that by adding the following flag into your `appConfigs/xxx/renative.json` file:

```
{
    platforms: {
        web: {
            deploy: {
                "docker": {
                    "healthcheckProbe": true
                }
            }
        }
    }
}
```

#### Zip the export

You can also instruct `rnv` to make a zip from the output files (`xx.tar` and `docker-compose.yml`) in order to make distribution easier.

You can do that by adding the following flag into your appConfigs/xxx/renative.json file:

```
{
    platforms: {
        web: {
            deploy: {
                "docker": {
                    "zipImage": true
                }
            }
        }
    }
}
```

#### Making changes

If you feel brave and want to modify any file, for example the nginx config, make sure you build your image again since everything is copied over at build step.

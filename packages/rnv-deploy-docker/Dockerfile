FROM alpine
EXPOSE 80
ADD nginx.default.conf /etc/nginx/conf.d/default.conf
COPY public /var/www/localhost/htdocs
RUN apk add nginx && \
    mkdir /run/nginx;
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /var/www/localhost/htdocs
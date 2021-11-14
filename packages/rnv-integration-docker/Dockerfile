FROM alpine
EXPOSE 80 443
COPY {{BUILD_FOLDER}} /var/www/localhost/htdocs
RUN apk add nginx && \
    apk add openssl && \
    openssl req -x509 -nodes -days 365 -subj "/C=CA/ST=QC/O=STL" -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt && \
    mkdir -p /run/nginx;
COPY nginx.default.conf /etc/nginx/nginx.conf
{{DOCKER_ADDITIONAL_COMMANDS}}
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /var/www/localhost/htdocs

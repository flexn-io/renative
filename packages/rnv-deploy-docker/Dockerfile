FROM alpine
EXPOSE 80
ADD config/default.conf /etc/nginx/conf.d/default.conf
{{COPY_CMD}}
RUN apk add nginx && \
    mkdir /run/nginx && \
    apk add nodejs && \
    apk add npm && \
    cd /var/www/localhost/htdocs && \
    rm -rf node_modules && \
    npm install && \
    npm run build;
CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
WORKDIR /var/www/localhost/htdocs
FROM nginx

COPY nginx.conf /etc/nginx/

EXPOSE 80

# CMD ["service", "nginx", "start"]
CMD ["nginx", "-g", "daemon off;"]
# CMD service nginx start

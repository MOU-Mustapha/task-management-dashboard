## Build Angular
FROM node:24.13.0 AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

## Serve app with nginx server
FROM nginx:alpine
COPY --from=build /app/dist/task-management-dashboard/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

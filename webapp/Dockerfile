FROM kkarczmarczyk/node-yarn
COPY yarn.lock .
COPY package.json .
RUN yarn install
COPY src/ src/
COPY public/ public/
RUN yarn build

FROM nginx:alpine
COPY --from=0 /workspace/build /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf

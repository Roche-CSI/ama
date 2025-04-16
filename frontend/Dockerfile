FROM node:22 AS ui-build
WORKDIR /usr/src/app
COPY ui_app/dist/ ./ui_app/build/
COPY node_app/dist ./

EXPOSE 3000

ENV KEY_FILE_NAME=""
ENV CERT_FILE_NAME=""

CMD ["node", "./node_app.bundle.js"]

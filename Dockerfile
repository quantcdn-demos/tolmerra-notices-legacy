# A fictional legacy notices site for a Quant demonstration: fixed pages only, no dependencies.
FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5
WORKDIR /app
COPY package.json server.mjs ./
COPY site ./site
# Owned by root and not writable: the app user (node, UID 1000) can only read the files.
RUN chmod -R a-w /app
USER node
ENV NODE_ENV=production PORT=8080
EXPOSE 8080
CMD ["node", "server.mjs"]

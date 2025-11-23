FROM node:20-slim AS build

WORKDIR /build
COPY . .

RUN npm i
RUN rm -r node_modules/.prisma
RUN npx prisma generate
RUN npm run build

RUN npm prune --omit=dev

FROM node:20-slim  AS runtime

WORKDIR /app

COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./dist
COPY --from=build /build/prisma ./prisma
COPY package.json ./
COPY package-lock.json ./

RUN mkdir -p /app/uploads/projects /app/uploads/deliverables
VOLUME ["/app/uploads"]

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
FROM node:16-buster-slim

RUN apt-get update && \
    apt-get install -y git vim

RUN npm install -g vercel

WORKDIR /app
COPY package.json package.json
RUN yarn install

COPY . .

EXPOSE 3000 3001

# CMD ["bash"]
CMD ["yarn", "dev"]

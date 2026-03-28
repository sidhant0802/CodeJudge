# ✅ REPLACE WITH THIS
FROM node:18-alpine

# Install compilers
RUN apk add --no-cache \
    g++ \
    gcc \
    python3 \
    py3-pip \
    bash \
    libc-dev

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

# Create temp folders
RUN mkdir -p /app/Compiler/codes \
             /app/Compiler/inputs \
             /app/Compiler/outputs

EXPOSE 8000
CMD ["node","server.js"]
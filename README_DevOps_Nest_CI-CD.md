# DevOps cơ bản cho NestJS Travel Web (Docker + GitHub Actions + Render)

## Phần mềm cần cài và Terminal dùng
- Node.js 20+ → lệnh `npm`, `npx`
- Git → lệnh `git`
- Docker Desktop → lệnh `docker`, `docker compose`
- (Tuỳ chọn) tài khoản Docker Hub + Render.com

Windows: PowerShell. macOS/Linux: Terminal.

## Thêm file vào app hay vào Docker?
- **App**: đặt `Dockerfile`, `Dockerfile.dev`, `docker-compose.dev.yml`, `.dockerignore`, `render.yaml`, `.github/workflows/*.yml` trong **repo** (thư mục dự án).
- **Docker**: khi build image, `Dockerfile` sẽ **COPY code** từ app vào image. Dev thì mount volume để hot reload (không cần rebuild mỗi đổi file).

## Dev với Docker (hot reload + MongoDB)
```bash
docker compose -f docker-compose.dev.yml up --build
# truy cập http://localhost:3000
# MongoDB: localhost:27017
docker compose -f docker-compose.dev.yml down
```

## Build production image (NestJS) và chạy
```bash
docker build -t travel-web-app:prod .
docker run -d -p 8080:3000 --name travel-app travel-web-app:prod
# mở http://localhost:8080
```

## CI build trên GitHub Actions
```bash
git init
git add .
git commit -m "init nestjs travel web + devops"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```
Workflow ở `.github/workflows/ci-build.yml` sẽ tự chạy build, test và lint.

## CD lên Render (không cần VPS)
### Cách A (Render tự build từ GitHub)
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start:prod`

### Cách B (Docker image + Deploy Hook)
- Tạo Image-backed service trên Render với image: `docker.io/<DOCKER_USERNAME>/travel-web-app:latest`
- Tạo MongoDB database service trên Render
- Lấy Deploy Hook URL và lưu vào GitHub secret `RENDER_DEPLOY_HOOK_URL`
- Secrets cần: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `RENDER_DEPLOY_HOOK_URL`
- Push code → workflow `.github/workflows/cd-render.yml` sẽ build/push image và trigger deploy.

## Cấu hình Database
- Development: MongoDB container trong docker-compose
- Production: MongoDB Atlas hoặc Render MongoDB service
- Prisma schema: `prisma/schema.prisma`
- Migrate: `npx prisma migrate dev`

## Lệnh nhanh
```bash
docker images
docker ps
docker logs -f travel-app
docker stop travel-app && docker rm travel-app
npx prisma studio  # Xem database
npx prisma generate  # Generate Prisma client
```

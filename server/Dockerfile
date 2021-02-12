FROM node:11-alpine

WORKDIR /app

COPY ./package.json ./

COPY ./ ./
# 외부 종속성없이 강화 된 정적 PIE 바이너리로 빌드 된 ffmpeg 바이너리가있는 이미지   
# 컨테이너에선 ffmpeg가 설치되있는게 아니라서  외부종속성 없이 강화된 바이너리들을 컨테이너에 넣어줘야됩니다
COPY --from=mwader/static-ffmpeg:4.3.1-2 /ffmpeg /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.3.1-2 /ffprobe /usr/local/bin/
COPY --from=mwader/static-ffmpeg:4.3.1-2 /qt-faststart /usr/local/bin/
# bcrypt를 컨테이너에 돌리기위해서 종속성 들을 같이 도커런할때 설치 해줘야됩니다.
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  apk del make gcc g++ python

RUN npm rebuild bcrypt 


CMD ["npm", "run", "start"]
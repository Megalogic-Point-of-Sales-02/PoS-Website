
FROM node:21-alpine

WORKDIR /app

# Define build-time arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG EMAIL_USER
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG GMAIL_REFRESH_TOKEN
ARG NEXT_PUBLIC_FAST_API_URL

# Set environment variables from build arguments
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV EMAIL_USER=$EMAIL_USER
ENV CLIENT_ID=$CLIENT_ID
ENV CLIENT_SECRET=$CLIENT_SECRET
ENV GMAIL_REFRESH_TOKEN=$GMAIL_REFRESH_TOKEN
ENV NEXT_PUBLIC_FAST_API_URL=$NEXT_PUBLIC_FAST_API_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

# Facebook Lite Back-end

This is the back-end component of the **Facebook-lite** project. It is responsible for handling the server-side logic and API endpoints.

Live server: https://facebook-back.vercel.app

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HungWorkplace/facebook-back.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a cluster in mongoDB
4. Create and get token in Cloudinary

5. Create `.env`
   ```bash
   SEED_DATA
   CORS_ORIGIN
   MONGO_URI
   JWT_SECRET
   JWT_EXPIRES_IN
   JWT_COOKIE_EXPIRES_IN
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   ```

## Usage

To start the server, run the following command:

```bash
npm dev
```

## API Endpoints

- `/auth`: This endpoint is used for authentication purposes.
- `/api/posts`: This endpoint is used for managing posts.
- `/api/users`: This endpoint is used for managing users.

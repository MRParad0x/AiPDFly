<<<<<<< HEAD
# AiPDFly
WEB-BASED AI-ENHANCED PDF DOCUMENT ANALYZER
=======
![image](https://github.com/rkf2778/chatpdf/assets/41117031/55660ed2-1bda-4f90-8714-e9cc0e1c209e)

# DEMO : https://chatpdfsass.vercel.app/

# Overview of the project

A comprehensive chat application with PDF integration. This project is designed
to provide a seamless chat experience where users can **upload PDF files**,
create chats around them, and **interact with an AI assistant**. The AI
assistant uses the OpenAI API to generate responses based on the chat context.
The application also includes a _subscription feature_, where users can
subscribe to access premium features. The subscription process is handled using
_Stripe for payments_ and webhooks for event processing.

![Untitled-2024-04-08-1959](https://github.com/rkf2778/chatpdf/assets/41117031/001d4c5b-4239-49e1-9f08-ae321686ca6f)

## Technologies and Frameworks

- Next.js
- React
- TypeScript
- Tailwind CSS
- Clerk
- Drizzle ORM
- PostgreSQL
- AWS SDK
- OpenAI API
- Stripe
- Axios
- Pinecone
- Drizzle-kit
- OpenAI Edge
- Neon Database Serverless
- Drizzle-orm/neon-http
- @tanstack/react-query
- @clerk/nextjs
- clsx
- tailwind-merge

---

## Environment Variables needed for the application

_Read steps below to get the values for the environment variables_

```Bash
#filename : .env
# CLERK SETUP
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# NEON DB
DATABASE_URL=

# AMAZON S3

# REGION
NEXT_PUBLIC_S3_BUCKET_REGION=
# Bucket Name
NEXT_PUBLIC_S3_BUCKET_NAME=
# Access Key
NEXT_PUBLIC_S3_ACCESS_KEY_ID=
# Secret Key
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=


# PINECONE
PINECONE_INDEX_NAME=
PINECONE_ENVIRONMENT=
PINECONE_API_KEY=

# OPENAI
OPENAI_API_KEY=

# STRIPE
STRIPE_API_KEY=
STRIPE_WEBHOOK_SIGNING_SECRET=
NEXT_BASE_URL=your_deployment_url
```

---

## Getting Started

1. Clone the repo and navigate to 'chatpdf' :

```Bash
git clone https://github.com/rkf2778/chatpdf
cd chatpdf
```

- Change following configuration for windows and Mac OS:
   - In "dev" script change between "set" and "export" based on the type of OS.

   - For windows :
      ```
      "scripts": {
         "dev": "set NODE_OPTIONS='--max-old-space-size=8192' && next dev",
         "build": "next build",
         "start": "next start",
         "lint": "next lint",
         "format": "prettier --check --ignore-path .gitignore .",
         "format:fix": "prettier --write --ignore-path .gitignore ."
      },
      ```
   - For Mac:
      ```
      "scripts": {
         "dev": "export NODE_OPTIONS='--max-old-space-size=8192' && next dev",
         "build": "next build",
         "start": "next start",
         "lint": "next lint",
         "format": "prettier --check --ignore-path .gitignore .",
         "format:fix": "prettier --write --ignore-path .gitignore ."
      },
      ```

2. **Install the dependencies** : Requires
   **[Node.js](https://nodejs.org/en/download/)** to be installed

```Bash
npm install
```

3.  **Setup Clerk**

- Create an account in [here](https://clerk.com/)
- Copy the keys displayed and paste it into the .env file :

```Bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= paste_key_here
  CLERK_SECRET_KEY= paste_key_here
```

4.  **NEON DB** (To get DATABASE_URL for .env file)

- Create an account [here](https://neon.tech/)
- Create a project
- Copy the URL shown and paste it into `DATABASE_URL` in .env file

```Bash
  DATABASE_URL = paste_key_here
```

5.  **Drizzle ORM** is edge compatible. Hence we use this instead of Prisma.
    `Plus it's faster than Prisma.`

- Push the DB to drizzle with drizzle-kit
- pg in below command stands for PostgreSQL

```Bash
  npx drizzle-kit push:pg
```

- Open Drizzle-kit studio

```Bash
  npx drizzle-kit studio
```

6. **Amazon S3 Bucket**

- Go to [Amazon S3 bucket](https://aws.amazon.com/s3/) and create a new bucket
- Give a unique bucket name
- Uncheck **_"Block Public Access settings for this bucket"_**
- Click on the acknowledge checkbox
- Click "Create Bucket"
- Go to that bucket
- Click "Permissions" tab
- Go down to "Bucket Policy" and click edit and write below :

```Bash
      {
      "Version": "2012-10-17",
      "Statement": [{
          "Sid": "Statement1",
          "Principal": "*",
          "Effect": "Allow",
          "Action": [
            "s3:GetObject"
          ],
          "Resource": ["arn:aws:s3::::chatpdfsaas/*"]
        }]
      }
```

- For `"Resource": ["arn:aws:s3::::bucketname/*"]` you have to replace
  `bucketname` and enter your bucket name instead.
- Press **"Save Changes"**
- Go down to `Cross-origin resource sharing (CORS)` and type :

```JavaScript
  [
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "DELETE",
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

- Click "Save changes"
- How to get the API Keys:

  - Search for "IAM" > Users > Click "Create user"
  - Enter name of user > Click Next
  - Permission Options : Set to "Attach policies directly"
  - Under permission policies, add the following policies: `AmazonS3FullAccess`
  - Click Next > Click `Create User`
  - Click the user you created
  - `Security Credentials` tab
  - Click "Create Access Key``
  - Select "Local Code" as use case
  - Click Next > Click Create Access Key
  - Add the following to your `.env` file

  ```Bash
  NEXT_PUBLIC_S3_BUCKET_NAME = your_bucket_name
  NEXT_PUBLIC_S3_ACCESS_KEY_ID = your_access_key
  NEXT_PUBLIC_S3_SECRET_ACCESS_KEY = your_secret_access_key
  ```

  - Change `region` in the file `s3.ts` to the region you have set for your
    bucket as below example

  ```JavaScript
  const s3 = new S3({
        region: "ap-southeast-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });
  ```

  - Also change the region (example `ap-southeast-1`) in the last line of the
    file

  ```JavaScript
    export function getS3Url(file_key: string) {
      const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`
      return url
    }
  ```

7. **Pinecone DB Setup**

- Go to [Pinecone](https://www.pinecone.io/) > Create an account
- Create new project > Create a new Index
  - Configure your Index
    - Dimensions : 1536
  - Click `Create Index`
- Create API Key and paste keys in `.env` file:
  - _PINECONE_ENVIRONMENT value is of the format REGION-ENVIRONMENT_

```Bash
PINECONE_INDEX_NAME=your_index_name
PINECONE_ENVIRONMENT=us-central1-gcp-starter
PINECONE_API_KEY=your_api_key
```

- Find the code as shown below in the files `src\lib\pinecone.ts` and
  `src\lib\context.ts` and enter your `Index Name` :

```Javascript
const pineconeIndex = await client.index('your_index_name')
```

8. **OPENAI API**

- Go to [OpenAI API](https://openai.com/blog/openai-api)
- Menu > API > Overview
- Click `For Developers` > `Embeddings`
- Login if not yet done
- Go to `API Keys` and create a new Secret Key
- Copy and paste API key into `.env` file

```Bash
OPENAI_API_KEY=your_api_key
```

9. **Stripe API Key**

- Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- Add `STRIPE_API_KEY`
-

```Bash
STRIPE_API_KEY=your_api_key
NEXT_BASE_URL=your_deployment_url
STRIPE_WEBHOOK_SIGNING_SECRET=your_signing_secret
```

- Go to
  [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
  and follow the instruction to get the `STRIPE_WEBHOOK_SIGNING_SECRET`:

  - Enter the `Endpoint URL` which is the URL (instead of `example.vercel.app`)
    of your deployment :

  ```
  https://example.vercel.app/api/webhook
  ```

  - Select event to listen to
    - checkout.session.completed
    - invoice.payment.succeeded
  - Click on `Add endpoint`
  - You'll get your `signing_secret`
  - Paste it into `STRIPE_WEBHOOK_SIGNING_SECRET`

<!-- - Run the following command in terminal to get value for `STRIPE_WEBHOOK_SIGNING_SECRET` :

```Bash
stripe listen --forward-to localhost:4242/webhook
``` -->
>>>>>>> 130efc1 (Initial commit)

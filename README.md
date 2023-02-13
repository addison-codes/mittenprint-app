This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/). API routes are separated by publications and locations.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


# Stack and Standards
## UI Elements
UI elements are styled via Tailwind CSS and we use [Flowbite](https://flowbite.com/) default component styling where applicable.

### Tables
Table UI is defined by Flowbite, however Table logic is managed by React Table from Tanstack.

#### Excel Exports
Excel exports are supported using SheetJS (`xlsx` package)

### Forms
Form UI is defined by Flowbite, however Form Logic is managed by React Hook Forms.

## Database
This project uses Fauna for data storage and utilizes Fauna's native GraphQL API and Javascript Driver for data access. The connection and API calls are established in `/utils/Fauna.js`.

## Data Fetching
This project uses SWR for data fetching for its more flexible data management toolset.

## Auth
Authorization is managed with Next Auth.

## Code Formatting
Code formatting is managed via Prettier as defined in `/.prettierrc.json`

This project also uses TypeScript where applicable (though minimally and inefficiently, as I am still learning it) and formatting code validation is supplied by ESLint


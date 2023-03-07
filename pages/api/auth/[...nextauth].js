import NextAuth from 'next-auth'
// import GithubProvider from 'next-auth/providers/github'
// import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import { userService } from "services/UserService"
import { Client as FaunaClient } from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

const client = new FaunaClient({
  secret: 'fnAE9b7xZ6AAQxtpTkikk1kh5wtuIiRw8BcbfBG5',
  scheme: "http",
  domain: "localhost",
  port: 8443,
})

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials.");
        }
        const { email, password } = credentials;
        return userService.signInCredentials(email, password);
      },
    }),
    // ...add more providers here
  ],
  adapter: FaunaAdapter(client),
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      /* Step 2: update the session.user based on the token object */
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)

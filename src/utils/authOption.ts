import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import { LoginRequest } from "@/interfaces/LoginRequest";
import { compare } from "bcrypt";

export const authOption: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Set username and password from input
        const { username, password } = credentials as LoginRequest;

        // fetch api to get the user
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/v2/auth/login", {
          method: "POST",
          body: JSON.stringify({ username: username, password: password }),
          headers: { "Content-Type": "application/json" },
        });
        let user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          user = user[0];

          // Compare the password using bcrypt
          const validatePassword = await compare(password, user.password);

          // if validatepassword true
          if (validatePassword) {
            // create accessToken
            const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.NEXTAUTH_SECRET, { expiresIn: "1d" });
            // return the user
            return { id: user.id, username: user.username, fullname: user.fullname, email: user.email, accessToken: accessToken };
          }
        }
        // Return null if user data could not be retrieved or password not validated
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        // token.id = user.id;
        // token.username = user.username;
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (token) {
        // session.user.id = token.id;
        // session.user.username = token.username;
        session.user = token;
      }

      return session;
    },
  },
};

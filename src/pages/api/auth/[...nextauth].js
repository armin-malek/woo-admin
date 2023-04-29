//import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import bcrypt from "bcrypt";
export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt(params) {
      return params.token;
    },
    async session({ session, token, user }) {
      session.user.id = token.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return "/auth/handle-auth-state";
    },
  },
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      type: "credentials",
      id: "custom-credentials",
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "string" },
        password: { label: "کلمه عبور", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("cred", credentials);
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          if (!user) {
            console.log("no user");
            return null;
          }

          if (credentials?.password == user.password) {
            console.log("ok pass");

            return user;
          } else {
            console.log("wrong pass");
            return null;
          }
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: `/auth/signin`,
  },
};

export default NextAuth(authOptions);

//export default NextAuth(authOptions);

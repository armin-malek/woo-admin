//import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import bcrypt from "bcrypt";
export const authOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt(params) {
      //update token
      console.log("jwt", params);
      //params.token.name = params.user.name;
      //params.token.id = params.user.id;
      console.log("jwt done");

      return params.token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      //console.log("sess token", token);
      console.log("sess", session, token, user);

      session.user.id = token.id;

      //delete session.image;
      console.log("sess done");
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
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "string" },
        password: { label: "کلمه عبور", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("cred");
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });

          // return user;
          if (!user) return null;
          return user;
          bcrypt.compare(
            credentials?.password,
            user.password,
            (err, result) => {
              console.log("result", result);
              if (err || !result) {
                console.log("return null");
                return null;
              }
              console.log("user", user);

              return user;
            }
          );
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

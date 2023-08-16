import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { createCreator, getCreatorByEmail } from "@utils/database";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string, // TODO: Configure env variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: {
    //       label: "Username:",
    //       type: "text",
    //       placeholder: "your username",
    //     },
    //     password: {
    //       label: "Password",
    //       type: "password",
    //       placeholder: "your password",
    //       // TODO: Add regex for password
    //     },
    //   },
    //   async authorize(credentials) {
    //     // TODO: Retrieve userdata to verify credentials
    //     const user = { id: "id", name: "testname", password: "password" };
    //     if (
    //       credentials?.username === user.name &&
    //       credentials?.password === user.password
    //     ) {
    //       return user;
    //     } else {
    //       return null;
    //     }
    //   },
    // }),
  ],

  // TODO: Adapter to store user session info in database: https://authjs.dev/reference/adapter/dynamodb

  // TODO: Add theming and branding: https://next-auth.js.org/configuration/options#theme

  // https://next-auth.js.org/configuration/callbacks
  // callbacks: {
  //   async session({ session }) {
  //     // TODO: Change this to .get() using an id - fastest lookup method
  //     const sessionUser = getCreatorByEmail(session.user.email);

  //     session.user.id = sessionUser.data[0].id;

  //     return session;
  //   },

  //   async signIn({ profile }) {
  //     try {
  //       // check if a user already exists
  //       // TODO: Change this to .get() using an id - fastest lookup method
  //       const userExists = getCreatorByEmail(profile.email);

  //       // if not, create a new user
  //       if (userExists.data.length === 0) {
  //         //if(!userExists){

  // const response = await creatorCreator({
  //             email: profile.email,
  //             username: profile.name.replace(" ", "").toLowerCase(),
  //             image: profile.picture,
  //   })
  //         // TODO: View returned creation data - does it return an id?
  //         console.log(response);
  //       }

  //       return true;
  //     } catch (error) {
  //       console.log(error);
  //       return false;
  //     }
  //   },
  // },
};

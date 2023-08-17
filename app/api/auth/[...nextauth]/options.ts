import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { createCreator, getCreatorByEmail } from "@utils/database";
import { Profile } from "next-auth";

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

  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // TODO: Add theming and branding: https://next-auth.js.org/configuration/options#theme

  //https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async session({ session }) {
      // TODO: Change this to .get() using an id - fastest lookup method
      const email = session.user?.email;
      if (!email) return session;

      // const sessionUser = await getCreatorByEmail(email);

      // console.log("sessionUser");
      // console.log(sessionUser);

      //if (session.user) session.user.creatorId = sessionUser.data[0].creatorId;

      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      try {
        if (account) {
          // Signing in with Google
          if (account.provider === "google") {
            if (!profile) return false;

            const googleProfile = profile as GoogleProfile;

            // Valid email
            if (!googleProfile.email) {
              return "/auth/error?error=AccessDenied";
            }
            // Verified email
            if (!googleProfile.email_verified) {
              return "/auth/error?error=AccessDenied";
            }

            const userExists = await getCreatorByEmail(googleProfile.email);

            // if not, create a new user
            if (userExists.data.length === 0) {
              const response = await createCreator({
                email: googleProfile.email,
                username: googleProfile.name.replace(" ", "").toLowerCase(),
                image: googleProfile.picture,
              });

              console.log(response);
            }
            return true;
          }
        }

        // Some other unknown login going on...
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

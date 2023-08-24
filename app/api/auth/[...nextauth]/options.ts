import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { Profile } from "next-auth";
import { setAuthAccessToken } from "@utils/api";
import {
  GetCreatorByEmailRequest,
  CreatorsApi,
} from "@minemarket/cdk-ts-fetch";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
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
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      console.log("Sub: " + token.sub);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // TODO: Change this to .get() using an id - fastest lookup method
      console.log("Enter session()");
      const email = session.user?.email;
      if (!email) return session;

      console.log("Session token: " + token);
      // Add authorization to api request
      if (token.sub) {
        setAuthAccessToken(token.sub);

        // Add user id to session data
        const sessionUser = await new CreatorsApi().getCreatorByEmail(email);
        console.log("session returned user: " + sessionUser);
        session.user.creatorId = sessionUser.creatorId;
      }

      // const sessionUser = await getCreatorByEmail(email);
      // session.user.creatorId = sessionUser.data[0].creatorId;

      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      console.log("Enter signIn()");
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

            // Add authorization to api request
            if (account.access_token) {
              console.log("Account access token: " + account.access_token);
              setAuthAccessToken(account.access_token);

              // Add user id to session data
              const request: GetCreatorByEmailRequest = {
                email: googleProfile.email,
              };
              const sessionUser = await new CreatorsApi().getCreatorByEmail(
                request
              );
              console.log("Sign in returned user: " + sessionUser);
              if (sessionUser) {
                // TODO: Create new creator
              }
            }

            // const userExists = await getCreatorByEmail(googleProfile.email);

            // // if not, create a new user
            // if (userExists.data.length === 0) {
            //   const response = await createCreator({
            //     email: googleProfile.email,
            //     username: googleProfile.name.replace(" ", "").toLowerCase(),
            //     image: googleProfile.picture,
            //   });

            //   console.log(response);
            // }
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

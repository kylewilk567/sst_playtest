import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Creator } from "@utils/database";
import { getCreatorById, getCreatorByEmail } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID, // TODO: Configure env variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // TODO: Change this to .get() using an id - fastest lookup method
      const sessionUser = getCreatorByEmail(session.user.email);

      session.user.id = sessionUser.data[0].id;

      return session;
    },
    async signIn({ profile }) {
      try {
        // check if a user already exists
        // TODO: Change this to .get() using an id - fastest lookup method
        const userExists = getCreatorByEmail(profile.email);

        // if not, create a new user
        if (userExists.data.length === 0) {
          //if(!userExists){

          const response = await Creator.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          }).go();
          // TODO: View returned creation data - does it return an id?
          console.log(response);
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };

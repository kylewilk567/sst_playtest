import { createCreator } from "@utils/database";
import { generateUsername } from "unique-username-generator";

export async function handler() {

    // Generate 10 users with maximum length constraint and no separator, no random digits
    for (let i = 0; i < 10; i++) {
        const username = generateUsername("", 0, 15);

        const creatorData = {
            username: username,
            email: `${username}@gmail.com`
        }
        await createCreator(creatorData);
    }


  }
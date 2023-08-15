// import { connectToDB } from '@utils/database';
// import Prompt from '@models/prompt';

// export const POST = async (req, res) => {
//     const {userId, prompt, tag} = await req.json();

//     try {
//         // TODO: fetch S3FileUpload IAM role for this user's session token
//         connectToDB();

//         // Respond with a pre-signed URL for the client to use to upload a file to S3

//         const newPrompt = new Prompt({ 
//             creator: userId, 
//             prompt,
//             tag});

//         await newPrompt.save();

//         return new Response(JSON.stringify(newPrompt), {status: 201 })
//     } catch(error){
//         return new Response("Failed to create a new prompt", {status: 500})
//     }
// }
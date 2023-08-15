import {Creator, CreateCreatorItem} from "@utils/entities";



/**
 * 
 * @param creatorId 
 * @returns 
 */
export async function getCreatorById(creatorId: string){
	return Creator.get({
		creatorId: creatorId,
	}).go();
}

/**
 * 
 * @param creatorEmail 
 * @returns 
 */
export async function getCreatorByEmail(creatorEmail: string){
	return Creator.query.emails({
			email: creatorEmail,
		}).go();
}

// TODO: By not using "await" in these functions, I allow the user to choose whether to await. Though this prevents me from formatting the response.
// - I should await by default, but give an option not to await. Not awaiting means the function will return an unformatted response.

// TODO: Add default image
// TODO: Create general utility function that automatically uploads profile picture to S3
/**
 * 
 * @param creator 
 * @returns 
 */
export async function createCreator(creationData: CreateCreatorItem){

	// Add default image path
	// if(!creationData.image || creationData.image.trim() === ""){
	// 	creationData.image = "defaults/profileImage";
	// }

	return Creator.create(creationData).go();
}
import {Entity, CreateEntityItem} from "electrodb";
import crypto from "crypto";
import {Dynamo} from "@utils/dynamo";


export const Creator = new Entity({
	model: {
		entity: "creator",
		version: "1",
		service: "creatorapp",
	},
	attributes: {
		creatorId: {
			type: "string",
			required: true,
			default: () => crypto.randomUUID(),
            readOnly: true,
		},
		username: {
			type: "string",
            required: true,
			label: "un", // Labels used to create keys. Can use abbreviation here to make generated keys smaller
		},
		email: {
			type: "string",
            required: true,
		},
		image: {
			type: "string", // S3 file path
		},
	},
	indexes: {
		// Get user by id (fastest)
		primary: {
            // collection: "webstores"
			pk: {
				field: "pk",
				composite: ["creatorId"],
			},
            sk: {
                field: "sk",
                composite: []
            },
		},
		// Get user by email
		emails: {
			index: "gsi1",
			pk: {
				field: "gsi1pk",
				composite: ["email"],
			},
            sk: {
                field: "gsi1sk",
                composite: []
            },
		}
	},
}, Dynamo.Configuration);

export type CreateCreatorItem = CreateEntityItem<typeof Creator>;
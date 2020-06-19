import path from 'path';

import { expect } from 'chai';

import openapi from './index';

describe('index', () => {
	it('works with example app', () => {
		const spec = openapi({
			cwd: path.join(__dirname, '../example/src'),
			verbose: false,
			throwLevel: 'warn',
		});

		// TODO: Do we need to purge undefined tags?
		expect(JSON.parse(JSON.stringify(spec))).to.deep.equal({
			openapi: '3.0.3',
			info: {
				title: 'Swagger Petstore',
				version: '1.0.5',
				'x-github': 'https://github.com/bee-travels',
				description:
					'This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/). For this sample, you can use the api key `special-key` to test the authorization filters.\n',
				termsOfService: 'http://swagger.io/terms/',
				contact: {
					email: 'bourdakos1@gmail.com',
				},
				license: {
					name: 'Apache 2.0',
					url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
				},
			},
			tags: [
				{
					name: 'pet',
					description: 'Everything about your Pets',
					externalDocs: {
						description: 'Find out more',
						url: 'http://swagger.io',
					},
				},
				{
					name: 'store',
					description: 'Access to Petstore orders',
				},
				{
					name: 'user',
					description: 'Operations about user',
					externalDocs: {
						description: 'Find out more about our store',
						url: 'http://swagger.io',
					},
				},
			],
			externalDocs: {
				description: 'Find out more about Swagger',
				url: 'http://swagger.io',
			},
			paths: {
				'/pet/{petId}': {
					get: {
						tags: ['pet'],
						summary: 'Find pet by ID',
						description: 'Returns a single pet',
						operationId: 'getPetById',
						parameters: [
							{
								name: 'petId',
								in: 'path',
								description: 'ID of pet to return',
								required: true,
								schema: { type: 'integer', format: 'int64' },
							},
						],
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: { $ref: '#/components/schemas/Pet' },
									},
									'application/xml': {
										schema: { $ref: '#/components/schemas/Pet' },
									},
								},
							},
							'400': { description: 'Invalid ID supplied' },
							'404': { description: 'Pet not found' },
						},
						security: [{ ApiKey: [] }],
					},
					post: {
						tags: ['pet'],
						summary: 'Updates a pet in the store with form data',
						operationId: 'updatePetWithForm',
						parameters: [
							{
								name: 'petId',
								in: 'path',
								description: 'ID of pet that needs to be updated',
								required: true,
								schema: { type: 'integer', format: 'int64' },
							},
						],
						requestBody: {
							content: {
								'application/x-www-form-urlencoded': {
									schema: { $ref: '#/components/schemas/UpdatePetObject' },
								},
							},
						},
						responses: { '405': { description: 'Invalid input' } },
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
					delete: {
						tags: ['pet'],
						summary: 'Deletes a pet',
						operationId: 'deletePet',
						parameters: [
							{
								name: 'apikey',
								in: 'header',
								required: false,
								schema: { type: 'string' },
							},
							{
								name: 'petId',
								in: 'path',
								description: 'Pet id to delete',
								required: true,
								schema: { type: 'integer', format: 'int64' },
							},
						],
						responses: {
							'400': { description: 'Invalid ID supplied' },
							'404': { description: 'Pet not found' },
						},
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
				},
				'/pet/{petId}/uploadImage': {
					post: {
						tags: ['pet'],
						summary: 'uploads an image',
						operationId: 'uploadFile',
						parameters: [
							{
								name: 'petId',
								in: 'path',
								description: 'ID of pet to update',
								required: true,
								schema: { type: 'integer', format: 'int64' },
							},
						],
						requestBody: {
							content: {
								'multipart/form-data': {
									schema: { $ref: '#/components/schemas/UploadPetImageObject' },
								},
							},
						},
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: { $ref: '#/components/schemas/ApiResponse' },
									},
								},
							},
						},
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
				},
				'/pet': {
					post: {
						tags: ['pet'],
						summary: 'Add a new pet to the store',
						operationId: 'addPet',
						requestBody: {
							description: 'Pet object that needs to be added to the store',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Pet' },
								},
								'application/xml': {
									schema: { $ref: '#/components/schemas/Pet' },
								},
							},
							required: true,
						},
						responses: { '405': { description: 'Invalid input' } },
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
					put: {
						tags: ['pet'],
						summary: 'Update an existing pet',
						operationId: 'updatePet',
						requestBody: {
							description: 'Pet object that needs to be added to the store',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Pet' },
								},
								'application/xml': {
									schema: { $ref: '#/components/schemas/Pet' },
								},
							},
							required: true,
						},
						responses: {
							'400': { description: 'Invalid ID supplied' },
							'404': { description: 'Pet not found' },
							'405': { description: 'Validation exception' },
						},
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
				},
				'/pet/findByStatus': {
					get: {
						tags: ['pet'],
						summary: 'Finds Pets by status',
						description:
							'Multiple status values can be provided with comma separated strings',
						operationId: 'findPetsByStatus',
						parameters: [
							{
								name: 'status',
								in: 'query',
								description:
									'Status values that need to be considered for filter',
								required: true,
								schema: {
									type: 'array',
									items: { $ref: '#/components/schemas/StatusEnum' },
								},
							},
						],
						responses: {
							'200': {
								description: 'Invalid status value',
								content: {
									'application/json': {
										schema: {
											type: 'array',
											items: { $ref: '#/components/schemas/Pet' },
										},
									},
									'application/xml': {
										schema: {
											type: 'array',
											items: { $ref: '#/components/schemas/Pet' },
										},
									},
								},
							},
							'400': { description: 'successful operation' },
						},
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
				},
				'/pet/findByTags': {
					get: {
						deprecated: true,
						tags: ['pet'],
						summary: 'Finds Pets by tags',
						description:
							"'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.'",
						operationId: 'findPetsByTags',
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: {
											type: 'array',
											items: { $ref: '#/components/schemas/Pet' },
										},
									},
									'application/xml': {
										schema: {
											type: 'array',
											items: { $ref: '#/components/schemas/Pet' },
										},
									},
								},
							},
							'400': { description: 'Invalid tag value' },
						},
						security: [{ PetstoreAuth: ['write:pets', 'read:pets'] }],
					},
				},
				'/store/inventory': {
					get: {
						tags: ['store'],
						summary: 'Returns pet inventories by status',
						description: 'Returns a map of status codes to quantities',
						operationId: 'getInventory',
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: { $ref: '#/components/schemas/Inventory' },
									},
								},
							},
						},
						security: [{ ApiKey: [] }],
					},
				},
				'/store/order/{orderId}': {
					get: {
						tags: ['store'],
						summary: 'Find purchase order by ID',
						description:
							'For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions',
						operationId: 'getOrderById',
						parameters: [
							{
								name: 'orderId',
								in: 'path',
								description: 'ID of pet that needs to be fetched',
								required: true,
								schema: { $ref: '#/components/schemas/OrderID' },
							},
						],
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: { $ref: '#/components/schemas/Order' },
									},
									'application/xml': {
										schema: { $ref: '#/components/schemas/Order' },
									},
								},
							},
							'400': { description: 'Invalid ID supplied' },
							'404': { description: 'Order not found' },
						},
					},
					delete: {
						tags: ['store'],
						summary: 'Delete purchase order by ID',
						description:
							'For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors',
						operationId: 'deleteOrder',
						parameters: [
							{
								name: 'orderId',
								in: 'path',
								description: 'ID of the order that needs to be deleted',
								required: true,
								schema: { $ref: '#/components/schemas/OrderID' },
							},
						],
						responses: {
							'400': { description: 'Invalid ID supplied' },
							'404': { description: 'Order not found' },
						},
					},
				},
				'/store/order': {
					post: {
						tags: ['store'],
						summary: 'Place an order for a pet',
						operationId: 'placeOrder',
						requestBody: {
							description: 'order placed for purchasing the pet',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Order' },
								},
							},
							required: true,
						},
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: { $ref: '#/components/schemas/Order' },
									},
									'application/xml': {
										schema: { $ref: '#/components/schemas/Order' },
									},
								},
							},
							'400': { description: 'Invalid Order' },
						},
					},
				},
				'/user': {
					post: {
						tags: ['user'],
						summary: 'Create user',
						description: 'This can only be done by the logged in user.',
						operationId: 'createUser',
						requestBody: {
							description: 'Created user object',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/User' },
								},
							},
							required: true,
						},
						responses: { default: { description: 'successful operation' } },
					},
				},
				'/user/createWithArray': {
					post: {
						tags: ['user'],
						summary: 'Creates list of users with given input array',
						operationId: 'createUsersWithArrayInput',
						requestBody: {
							description: 'List of user object',
							content: {
								'application/json': {
									schema: {
										type: 'array',
										items: { $ref: '#/components/schemas/User' },
									},
								},
							},
							required: true,
						},
						responses: { default: { description: 'successful operation' } },
					},
				},
				'/user/createWithList': {
					post: {
						tags: ['user'],
						summary: 'Creates list of users with given input array',
						operationId: 'createUsersWithListInput',
						requestBody: {
							description: 'List of user object',
							content: {
								'application/json': {
									schema: {
										type: 'array',
										items: { $ref: '#/components/schemas/User' },
									},
								},
							},
							required: true,
						},
						responses: { default: { description: 'successful operation' } },
					},
				},
				'/user/{username}': {
					get: {
						tags: ['user'],
						summary: 'Get user by user name',
						operationId: 'getUserByName',
						parameters: [
							{
								name: 'username',
								in: 'path',
								description:
									'The name that needs to be fetched. Use user1 for testing.',
								required: true,
								schema: { type: 'string' },
							},
						],
						responses: {
							'200': {
								description: 'successful operation',
								content: {
									'application/json': {
										schema: { $ref: '#/components/schemas/User' },
									},
									'application/xml': {
										schema: { $ref: '#/components/schemas/User' },
									},
								},
							},
							'400': { description: 'Invalid username supplied' },
							'404': { description: 'User not found' },
						},
					},
					put: {
						tags: ['user'],
						summary: 'Updated user',
						description: 'This can only be done by the logged in user.',
						operationId: 'updateUser',
						parameters: [
							{
								name: 'username',
								in: 'path',
								description: 'name that need to be updated',
								required: true,
								schema: { type: 'string' },
							},
						],
						requestBody: {
							description: 'Updated user object',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/User' },
								},
							},
							required: true,
						},
						responses: {
							'400': { description: 'Invalid user supplied' },
							'404': { description: 'User not found' },
						},
					},
					delete: {
						tags: ['user'],
						summary: 'Delete user',
						description: 'This can only be done by the logged in user.',
						operationId: 'deleteUser',
						parameters: [
							{
								name: 'username',
								in: 'path',
								description: 'The name that needs to be deleted',
								required: true,
								schema: { type: 'string' },
							},
						],
						responses: {
							'400': { description: 'Invalid username supplied' },
							'404': { description: 'User not found' },
						},
					},
				},
				'/user/login': {
					get: {
						tags: ['user'],
						summary: 'Logs user into the system',
						operationId: 'loginUser',
						parameters: [
							{
								name: 'username',
								in: 'query',
								description: 'The user name for login',
								required: true,
								schema: { type: 'string' },
							},
							{
								name: 'password',
								in: 'query',
								description: 'The password for login in clear text',
								required: true,
								schema: { type: 'string' },
							},
						],
						responses: {
							'200': {
								description: 'successful operation',
								headers: {
									'X-Expires-After': {
										description: 'date in UTC when token expires',
										schema: { type: 'string', format: 'date-time' },
									},
									'X-Rate-Limit': {
										description: 'calls per hour allowed by the user',
										schema: { type: 'integer', format: 'int32' },
									},
								},
								content: {
									'application/json': { schema: { type: 'string' } },
									'application/xml': { schema: { type: 'string' } },
								},
							},
							'400': { description: 'Invalid username/password supplied' },
						},
					},
				},
				'/user/logout': {
					get: {
						tags: ['user'],
						summary: 'Logs out current logged in user session',
						operationId: 'logoutUser',
						responses: { default: { description: 'successful operation' } },
					},
				},
			},
			components: {
				schemas: {
					Category: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							name: { type: 'string' },
						},
						xml: { name: 'Category' },
					},
					Pet: {
						type: 'object',
						required: ['name', 'photoUrls'],
						properties: {
							id: { type: 'integer', format: 'int64' },
							category: { $ref: '#/components/schemas/Category' },
							name: { type: 'string', example: 'doggie' },
							photoUrls: {
								type: 'array',
								xml: { wrapped: true },
								items: { type: 'string', xml: { name: 'photoUrl' } },
							},
							tags: {
								type: 'array',
								xml: { wrapped: true },
								items: {
									xml: { name: 'tag' },
									$ref: '#/components/schemas/Tag',
								},
							},
						},
					},
					Tag: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							name: { type: 'string' },
						},
						xml: { name: 'Tag' },
					},
					StatusEnum: {
						type: 'string',
						enum: ['available', 'pending', 'sold'],
						default: 'available',
					},
					ApiResponse: {
						type: 'object',
						properties: {
							code: { type: 'integer', format: 'int32' },
							type: { type: 'string' },
							message: { type: 'string' },
						},
					},
					UpdatePetObject: {
						type: 'object',
						properties: {
							name: { type: 'string', description: 'Updated name of the pet' },
							status: {
								type: 'string',
								description: 'Updated status of the pet',
							},
						},
					},
					UploadPetImageObject: {
						type: 'object',
						properties: {
							additionalMetadata: {
								type: 'string',
								description: 'Additional data to pass to server',
							},
							file: {
								type: 'string',
								format: 'binary',
								description: 'file to upload',
							},
						},
					},
					Inventory: {
						type: 'object',
						additionalProperties: { type: 'integer', format: 'int32' },
					},
					OrderID: {
						type: 'integer',
						maximum: 10,
						minimum: 1,
						format: 'int64',
					},
					Order: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							petId: { type: 'integer', format: 'int64' },
							quantity: { type: 'integer', format: 'int32' },
							shipDate: { type: 'string', format: 'date-time' },
							status: {
								type: 'string',
								description: 'Order Status',
								enum: ['placed', 'approved', 'delivered'],
							},
							complete: { type: 'boolean' },
						},
						xml: { name: 'Order' },
					},
					User: {
						type: 'object',
						properties: {
							id: { type: 'integer', format: 'int64' },
							username: { type: 'string' },
							firstName: { type: 'string' },
							lastName: { type: 'string' },
							email: { type: 'string' },
							password: { type: 'string' },
							phone: { type: 'string' },
							userStatus: {
								type: 'integer',
								format: 'int32',
								description: 'User Status',
							},
						},
						xml: { name: 'User' },
					},
				},
				securitySchemes: {
					ApiKey: { type: 'apiKey', name: 'api_key', in: 'header' },
					PetstoreAuth: {
						type: 'oauth2',
						flows: {
							implicit: {
								authorizationUrl: 'https://petstore.swagger.io/oauth/authorize',
								scopes: {
									'read:pets': 'read your pets',
									'write:pets': 'modify pets in your account',
								},
							},
						},
					},
				},
			},
		});
	});
});

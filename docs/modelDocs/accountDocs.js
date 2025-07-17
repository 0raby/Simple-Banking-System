// docs/swagger/accountDocs.js

module.exports = {
  '/api/accounts': {
    get: {
      summary: 'Get all accounts',
      tags: ['Accounts'],
      responses: {
        200: {
          description: 'List of all accounts',
        },
        400: {
          description: 'Error in getting all accounts',
        },
      },
    },
    post: {
      summary: 'Create a new account',
      tags: ['Accounts'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                creditCardNo: { type: 'string' },
                expDate: { type: 'string' },
                cvv: { type: 'string' },
                balance: { type: 'number' },
                nationalID: { type: 'string' },
              },
              example: {
                name: 'newUser1',
                creditCardNo: '1111222233334444',
                expDate: '01/26',
                cvv: '1234',
                balance: 1500,
                nationalID: '1234',
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Account created',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: { account: {} },
                message: 'Account created',
              },
            },
          },
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'error',
              },
            },
          },
        },
      },
    },
  },

  '/api/accounts/{id}': {
    get: {
      summary: 'Get a single account by ID',
      tags: ['Accounts'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'MongoDB ID of the account',
          schema: { type: 'string', example: '686d0337c52efd3bdf698d6a' },
        },
      ],
      responses: {
        200: {
          description: 'Account found',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: { account: {} },
              },
            },
          },
        },
        404: {
          description: 'Account not found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Account not found',
              },
            },
          },
        },
      },
    },

    patch: {
      summary: 'Update an existing account by ID',
      tags: ['Accounts'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'MongoDB ID of the account',
          schema: { type: 'string', example: '686d0337c52efd3bdf698d6a' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                balance: { type: 'number' },
                name: { type: 'string' },
                expDate: { type: 'string' },
                cvv: { type: 'string' },
              },
              example: {
                name: 'updatedUser',
                balance: 3000,
                expDate: '02/30',
                cvv: '567',
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Account updated',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: { account: {} },
              },
            },
          },
        },
        400: {
          description: 'Invalid input',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Invalid input',
              },
            },
          },
        },
        404: {
          description: 'Account not found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Account not found',
              },
            },
          },
        },
      },
    },

    delete: {
      summary: 'Delete an account by ID',
      tags: ['Accounts'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'MongoDB ID of the account',
          schema: { type: 'string', example: '686d0337c52efd3bdf698d6a' },
        },
      ],
      responses: {
        204: {
          description: 'Account deleted successfully',
        },
        404: {
          description: 'Account not found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Account not found',
              },
            },
          },
        },
      },
    },
  },
};

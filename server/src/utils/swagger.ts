import * as fs from 'fs';
import * as path from 'path';

import swaggerAutogen from 'swagger-autogen';
import swaggerUi from 'swagger-ui-express';

const swaggerAutogenInstance = swaggerAutogen();

const outputFile = path.resolve(__dirname, '../../swagger.output.json');
const endpointsFiles = [
  path.resolve(__dirname, '../routes/authRoutes.ts'),
  path.resolve(__dirname, '../routes/leadRoutes.ts'),
];

const swaggerDocument = fs.existsSync(outputFile)
  ? JSON.parse(fs.readFileSync(outputFile, 'utf8'))
  : {
      openapi: '3.0.3',
      info: {
        title: 'GigFlow API',
        description: 'Swagger documentation for the GigFlow backend API.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'https://gigflow-pysn.onrender.com',
          description: 'Production',
        },
        {
          url: 'http://localhost:3000',
          description: 'Local development',
        },
      ],
    };

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerDocument);

export const generateSwagger = async (): Promise<void> => {
  await swaggerAutogenInstance(outputFile, endpointsFiles, swaggerDocument);

  // Post-process generated output to ensure OpenAPI-only and add useful metadata
  if (fs.existsSync(outputFile)) {
    const raw = fs.readFileSync(outputFile, 'utf8');
    const doc = JSON.parse(raw);

    // Remove legacy swagger field if present
    if (doc.swagger) {
      delete doc.swagger;
    }

    // Helper to safely add requestBody/security to an operation
    const addOperationMetadata = (op: any, meta: any) => {
      if (!op || typeof op !== 'object') return;
      Object.assign(op, meta);
    };

    const newPaths: Record<string, any> = {};
    Object.keys(doc.paths || {}).forEach((p) => {
      let newPath = p;

      // Auth routes: prefix /register, /login, /refresh, /me, /assignable-users
      if (p === '/register') newPath = '/api/auth/register';
      if (p === '/login') newPath = '/api/auth/login';
      if (p === '/refresh') newPath = '/api/auth/refresh';
      if (p === '/me') newPath = '/api/auth/me';
      if (p === '/assignable-users') newPath = '/api/auth/assignable-users';

      // Leads routes
      if (p === '/') newPath = '/api/leads';
      if (p === '/export') newPath = '/api/leads/export';
      if (p === '/bulk-delete') newPath = '/api/leads/bulk-delete';
      if (p === '/{id}') newPath = '/api/leads/{id}';

      newPaths[newPath] = doc.paths[p];
    });

    doc.paths = newPaths;

    // Add metadata to known endpoints
    // Auth: register
    if (doc.paths['/api/auth/register'] && doc.paths['/api/auth/register'].post) {
      addOperationMetadata(doc.paths['/api/auth/register'].post, {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string' } },
                required: ['name', 'email', 'password'],
              },
              example: { name: 'Jane Doe', email: 'jane@example.com', password: 'secret123', role: 'sales' },
            },
          },
        },
        responses: { '201': { description: 'User created' }, '400': { description: 'Validation error' } },
      });
    }

    // Auth: login
    if (doc.paths['/api/auth/login'] && doc.paths['/api/auth/login'].post) {
      addOperationMetadata(doc.paths['/api/auth/login'].post, {
        summary: 'Log in',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] }, example: { email: 'jane@example.com', password: 'secret123' } } },
        },
        responses: { '200': { description: 'Auth token and user' }, '400': { description: 'Invalid credentials' } },
      });
    }

    // Protected endpoints: add security where appropriate
    const protectPath = (pathKey: string) => {
      if (doc.paths[pathKey]) {
        Object.keys(doc.paths[pathKey]).forEach((method) => {
          const op = doc.paths[pathKey][method];
          if (op && typeof op === 'object') {
            op.security = op.security || [{ bearerAuth: [] }];
          }
        });
      }
    };

    [' /api/auth/refresh', '/api/auth/me', '/api/auth/assignable-users'].forEach(() => {}); // noop to keep lint quiet

    protectPath('/api/auth/refresh');
    protectPath('/api/auth/me');
    protectPath('/api/auth/assignable-users');
    protectPath('/api/leads');
    protectPath('/api/leads/export');
    protectPath('/api/leads/bulk-delete');
    protectPath('/api/leads/{id}');

    // Add parameters and requestBody for leads endpoints if present
    if (doc.paths['/api/leads'] && doc.paths['/api/leads'].post) {
      addOperationMetadata(doc.paths['/api/leads'].post, {
        summary: 'Create a new lead',
        tags: ['Leads'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { name: 'Acme Lead', email: 'lead@acme.com', status: 'new', source: 'website' },
            },
          },
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Validation error' } },
      });
    }

    if (doc.paths['/api/leads'] && doc.paths['/api/leads'].get) {
      doc.paths['/api/leads'].get.parameters = doc.paths['/api/leads'].get.parameters || [];
      const existingParams = doc.paths['/api/leads'].get.parameters.map((p: any) => p.name);
      const paramsToAdd = [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Comma-separated statuses' },
        { name: 'source', in: 'query', schema: { type: 'string' }, description: 'Comma-separated sources' },
        { name: 'sortBy', in: 'query', schema: { type: 'string' } },
        { name: 'sortOrder', in: 'query', schema: { type: 'string' } },
        { name: 'sort', in: 'query', schema: { type: 'string', enum: ['latest', 'oldest'] } },
      ];
      paramsToAdd.forEach((p) => { if (!existingParams.includes(p.name)) doc.paths['/api/leads'].get.parameters.push(p); });
    }

    if (doc.paths['/api/leads/bulk-delete'] && doc.paths['/api/leads/bulk-delete'].post) {
      addOperationMetadata(doc.paths['/api/leads/bulk-delete'].post, {
        summary: 'Bulk delete leads',
        tags: ['Leads'],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' } } }, required: ['ids'] }, example: { ids: ['id1','id2'] } } } },
        responses: { '200': { description: 'Deleted' }, '400': { description: 'Invalid ids' } },
      });
    }

    // ensure components.securitySchemes exists
    doc.components = doc.components || {};
    doc.components.securitySchemes = doc.components.securitySchemes || { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } };

    fs.writeFileSync(outputFile, JSON.stringify(doc, null, 2), 'utf8');
  }
};

if (require.main === module) {
  generateSwagger()
    .then(() => {
      console.log(`Swagger output generated at ${outputFile}`);
    })
    .catch((error: unknown) => {
      console.error('Failed to generate swagger output:', error);
      process.exitCode = 1;
    });
}
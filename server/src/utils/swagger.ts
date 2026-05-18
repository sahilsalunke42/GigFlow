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
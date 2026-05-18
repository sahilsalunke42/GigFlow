import fs from 'fs';

const dependencies = JSON.parse(fs.readFileSync('./package.json', 'utf-8')).devDependencies;

export default {
  dependencies
};

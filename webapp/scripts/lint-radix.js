#!/usr/bin/env node
/**
 * Cross-platform script to lint files containing SelectItem
 * Replaces: grep -l -r '<SelectItem' src | xargs eslint --config config/eslint/eslint.radix.config.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { execSync } from 'child_process';

const searchDir = process.argv[2] || 'src';
const eslintConfig = 'config/eslint/eslint.radix.config.js';
const eslintArgs = process.argv.slice(3).join(' ');

function findFilesWithSelectItem(dir, fileList = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findFilesWithSelectItem(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      try {
        const content = readFileSync(filePath, 'utf8');
        if (content.includes('<SelectItem')) {
          fileList.push(filePath);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
  
  return fileList;
}

try {
  const files = findFilesWithSelectItem(searchDir);
  
  if (files.length === 0) {
    console.log('No files found containing <SelectItem');
    process.exit(0);
  }
  
  // Run eslint on all found files
  const filesArg = files.map(f => `"${f}"`).join(' ');
  const command = `npx eslint --config ${eslintConfig} ${eslintArgs} ${filesArg}`;
  
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  if (error.status !== undefined) {
    process.exit(error.status);
  }
  console.error('Error:', error.message);
  process.exit(1);
}


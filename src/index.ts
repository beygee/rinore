import * as repl from 'repl';
import * as yargs from 'yargs';

import { start as startCoffeeScript } from './coffeescript';
import { start as startJavascript } from './javascript';
import { start as startTypescript } from './typescript';

import { loadModules } from './context';

export const startCLI = () => {
  const argv = yargs
    .option('l', {
      alias: 'language',
      description: 'REPL language. javascript or coffeescript or typescript. The default is javascript',
    })
    .option('r', {
      alias: 'require',
      array: true,
      description: 'preload the given module',
    })
    .argv;

  loadModules(argv.require as string[]);

  start({language: argv.language as string})
  .on('exit', () => {
    // exit CLI process even if there are scheduled works
    setImmediate(() => {
      process.exit(0);
    });
  });
};

export interface IRinoreOptions {
  language?: string;
  prompt?: string;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  terminal?: boolean;
}

export const start = (options: IRinoreOptions = {}): repl.REPLServer => {
  if (options.language === 'coffeescript') {
    return startCoffeeScript(options);
  } else if (options.language === 'typescript') {
    return startTypescript(options);
  } else {
    return startJavascript(options);
  }
};

export { context } from './context';

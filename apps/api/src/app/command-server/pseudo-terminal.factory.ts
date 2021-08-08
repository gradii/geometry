import { PseudoTerminalFactory } from '@devops-tools/command-server';
import { platform } from 'os';
import * as spawn from 'cross-spawn';

export const nodePseudoTerminalFactory: PseudoTerminalFactory = ({
                                                                   displayCommand,
                                                                   program,
                                                                   args,
                                                                   cwd,
                                                                   env = {},
                                                                   isWsl
                                                                 }) => {
  const DEFAULT_ROWS = 24;
  const DEFAULT_COLS = 20;

  const opts = {
    cwd,
    // stdio: 'inherit',
    // cols: DEFAULT_COLS,
    // rows: DEFAULT_ROWS,
    env: {
      //for security disable all process.env
      // ...(process.env as { [key: string]: string }),
      PWD : process.env.PWD,
      USER: process.env.USER,
      PATH: process.env.PATH,
      LANG: process.env.LANG,
      // CI: 'true'
      ...env,
      CI  : 'true'
    }
  };

  let commandRunning = spawn(
    program,
    args,
    opts
  );
  // commandRunning.stdout.setEncoding('utf8');
  // commandRunning.stderr.setEncoding('utf8');

  let terminated = false;

  return {
    onDidWriteData: callback => {
      if (terminated) {
        return;
      }
      callback(`[cwd]${cwd}\n $ ${displayCommand}\n\n`);
      // commandRunning.stdout.on('data', function(data) {
      //   callback(data);
      // });
      commandRunning.stdout.on('data', (data: Buffer | string) => {
        callback(data.toString());
      });
      commandRunning.on('close', (exitCode: number, err) => {
        if (exitCode === 0) {
          callback('\nProcess completed 🙏');
        } else {
          callback(`\nProcess failed with exit code ${exitCode} 🐳`);
        }
      });
    },
    onError       : callback => {
      commandRunning.stderr.on('data', (data: Buffer | string) => {
        callback(data.toString());
      });
    },
    onExit        : callback => {
      commandRunning.on('close', (code: number) => {
        terminated = true;
        callback(code);
      });
    },
    kill          : () => {
      if (platform() === 'win32') {
        commandRunning.kill();
      } else {
        commandRunning.kill('SIGKILL');
      }
    }
  };
};

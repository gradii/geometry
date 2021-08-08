import { nodePseudoTerminalFactory } from './pseudo-terminal.factory';
import { Commands, Executable, ExecutableType, FileUtils } from '@devops-tools/command-server';

describe('pseudo terminal factory', () => {
  it('expect terminal', () => {
    const command = nodePseudoTerminalFactory({
      name          : 'test',
      displayCommand: 'display command',
      program       : 'node',
      args          : ['-v'],
      cwd           : '',
      isWsl         : false,
      isDryRun      : false
    });
    // expect('ssf')
    command.onDidWriteData((data) => {
      console.log(data);
    });

    command.onError((data) => {
      console.log(data);
    });
  });

  it('should build project to dist', (done) => {
    const command = nodePseudoTerminalFactory({
      name          : 'test',
      displayCommand: 'display command',
      program       : 'yarn',
      args          : ['install'],
      cwd           : 'tmp/projects/test-generate/98h7coa7lff',
      isWsl         : false,
      isDryRun      : false
    });

    command.onDidWriteData((data) => {
      // expect(data).toMatchSnapshot();
      const value = data.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
      );
      console.log(value);
    });

    command.onError((data) => {
      // expect(data).toMatchSnapshot();
      const value = data.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        ''
      );
      console.log(value);
    });

    command.onExit(() => {
      console.log('exit');
      done();
    });
  });

  it('test command excutable', () => {
    const c = new Commands(5, 15);

    const executable = new Executable(
      'name1',
      nodePseudoTerminalFactory,
      new FileUtils(),
      c
    );

    const { id } = executable.run(ExecutableType.npm, 'tmp', ['nx', 'build', 'backend']);
    c.findMatchingCommand(id, c.history);

  });
});

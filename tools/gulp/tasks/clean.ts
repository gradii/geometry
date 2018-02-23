import { task } from 'gulp';
import { cleanTask } from '../util/task_helpers';
import { buildConfig } from 'material2-build-tools';

import { resolve } from 'path';

/** Deletes the dist/ directory. */
task('clean', cleanTask(buildConfig.outputDir));

task('clean:docs', cleanTask(resolve(buildConfig.outputDir, 'docs')));

import {task} from 'gulp';
import { createPackageBuildTasks, sequenceTask } from 'material2-build-tools';
import { trianglePackage } from './packages';
import './tasks/aot';
import './tasks/breaking-changes';
import './tasks/ci';
import './tasks/clean';
import './tasks/default';
import './tasks/development';
import './tasks/example-module';
import './tasks/lint';
import './tasks/release';
import './tasks/unit-test';
import './tasks/universal';

createPackageBuildTasks(trianglePackage);

/** Task that builds all available release packages. */
// task('build-release-packages', sequenceTask(
//   'clean',
//   allBuildPackages.map(buildPackage => `${buildPackage.name}:build-release`)
// ));

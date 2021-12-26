import {createPackageBuildTasks} from '../package-tools';
import {
  cdkExperimentalPackage,
  cdkPackage,
  googleMapsPackage,
  materialExperimentalPackage,
  materialPackage,
  momentAdapterPackage,
  youTubePlayerPackage
} from './packages';

import './tasks/clean';
import './tasks/unit-test';
import './tasks/ci';
import './tasks/fedaco-gen-doc';
import './tasks/generate-md-using-ts-morph';
import './tasks/concat-functions';
import './tasks/check-import';

// createPackageBuildTasks(cdkPackage);
// createPackageBuildTasks(cdkExperimentalPackage);
// createPackageBuildTasks(materialPackage);
// createPackageBuildTasks(materialExperimentalPackage);
// createPackageBuildTasks(momentAdapterPackage);
// createPackageBuildTasks(youTubePlayerPackage);
// createPackageBuildTasks(googleMapsPackage);


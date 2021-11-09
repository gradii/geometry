pipeline {
  agent {
    node {
      label 'nodejs-large'
    }
  }

  parameters {
    string(name: 'TAG_NAME', defaultValue: '', description: '')
  }

  environment {
    DOCKER_CREDENTIAL_ID = 'private-registry-id'
    GITHUB_CREDENTIAL_ID = 'github-id'
    KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-triangle-id'
    NPM_CREDENTIAL_ID = 'npm-registry-id'
    REGISTRY = 'registry.cn-hangzhou.aliyuncs.com'
    DOCKERHUB_NAMESPACE = 'gradii'
    GITHUB_ACCOUNT = 'linpolen'
    APP_NAME = 'triangle'
    BRANCH_NAME =  "${BRANCH_NAME.replaceAll(/[^0-9a-zA-Z\-]/, '-').replaceAll(/-{2,}/, '-').toLowerCase()}"
    CYPRESS_INSTALL_BINARY = '0'
  }

  stages {
//     stage('unit test') {
//       steps {
//         container('maven') {
//           sh 'mvn clean -o -gs `pwd`/configuration/settings.xml test'
//         }
//
//       }
//     }

    stage('prepare tools') {
      steps {
        //         container('nodejs') {
        //           sh 'yum install patch -y'
        //         }
        container('nodejs') {

          sh 'yarn node scripts/cache-node-modules.js'
          sh 'yarn install'
        }
      }
    }

//     stage('store yarn.lock') {
//       steps {
//           archiveArtifacts 'yarn.lock'
//       }
//     }

    stage('build & push npm package') {
      when {
        anyOf {
          branch 'release'
        }
      }
      steps {
        container('nodejs') {
          sh 'yarn run build'
        //           sh 'docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'
        //           withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
        //             sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
        //             sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
        //           }
        }
      }
    }

    stage('build') {
      parallel {
        stage('deploy dev-app') {
          when {
            // branch 'master'
            allOf {
              not {
                branch 'release'
              }
              anyOf {
                changeset 'src/annotation/**'
                changeset 'src/check-type/**'
                changeset 'src/dev-app/**'
              }
            }
          }
          steps {
            container('nodejs') {
              sh 'yarn run deploy-dev-app'
              sh 'docker build -f Dockerfile-dev-app -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER .'
              withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
                sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER'
              }
            }
            //'push latest'
            container('nodejs') {
              sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
              sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
            }
            //'deploy to dev'
            container('jnlp') {
              sh 'kubectl apply -f deploy/dev-ol/**'
            }
//             kubernetesDeploy(configs: 'deploy/dev-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
          }
        }

        stage('build fedaco') {
          when {
            allOf {
              not {
                branch 'release'
              }
              anyOf {
                changeset 'src/annotation/**'
                changeset 'src/check-type/**'
                changeset 'src/fedaco/**'
              }
            }
          }

          steps {
            container('nodejs') {
              withCredentials([usernamePassword(passwordVariable : 'NPM_PASSWORD' ,usernameVariable : 'NPM_USERNAME' ,credentialsId : "$NPM_CREDENTIAL_ID" ,)]) {
                sh 'npm config set @gradii:registry https://npm.pkg.github.com/'
                sh 'npm config set //npm.pkg.github.com/:_authToken $NPM_PASSWORD'
              }
              sh 'yarn run deploy-fedaco'

              sh 'yarn publish dist/releases/fedaco'
            }

            container('nodejs') {
//               script {
//                 try {
//                   timeout(time:30, unit:'SECONDS') {
//                     input(id: 'push fedaco', message: 'push fedaco to github?')
//                   }
//                 } catch(err) { // timeout reached or input Aborted
//                   def user = err.getCauses()[0].getUser()
//                   if('SYSTEM' == user.toString()) { // SYSTEM means timeout
//                     currentBuild.result = "SUCCESS"
//                   } else {
//                     echo "Input aborted by: [${user}]"
//                     error("Pipeline aborted by: [${user}]")
//                   }
//                 }
//               }

              //withCredentials([sshUserPrivateKey(credentialsId: "yourkeyid", keyFileVariable: 'keyfile')]) {
              //   stage('scp-f/b') {
              //    sh "scp -i ${keyfile} do sth here"
              //   }
              //}
              withCredentials([usernamePassword(credentialsId: "$GITHUB_CREDENTIAL_ID", passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                sh 'git clone https://$GIT_USERNAME:$GIT_PASSWORD@github.com/gradii/fedaco.git fedaco-tmp'
                sh 'git config --global user.email "xsilen@gradii.com" '
                sh 'git config --global user.name "xsilen" '
                sh 'cp -r dist/releases/fedaco/esm2015/src/* fedaco-tmp/libs/fedaco/orm/src/'
                sh 'cp -r dist/releases/fedaco/src/* fedaco-tmp/libs/fedaco/orm/types/'
                sh 'cp -r dist/releases/fedaco/README.md fedaco-tmp/'
                dir("fedaco-tmp") {
                  sh 'git commit -am "chore: update fedaco"'
                  sh 'git push https://$GIT_USERNAME:$GIT_PASSWORD@github.com/gradii/fedaco.git'
                }
              }
            }
          }
        }

        stage('deploy triangle-api') {
          environment {
            APP_NAME = 'triangle-api'
          }
          when {
            // branch 'master'
            allOf {
              not {
                branch 'release'
              }
              anyOf {
                changeset 'apps/triangle-api/**'
              }
            }
          }
          steps {
            container('nodejs') {
              sh 'yarn nx build triangle-api'
              sh 'docker build -f Dockerfile-triangle-api -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER .'
              withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {
                sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
                sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER'
              }
            }
            //'push latest'
            container('nodejs') {
              sh 'docker tag  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BRANCH_NAME-$BUILD_NUMBER $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
              sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:latest '
            }
            //'deploy to dev'
            container('jnlp') {
              sh 'kubectl apply -f deploy/dev-api/**'
            }
//             kubernetesDeploy(configs: 'deploy/dev-api/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
          }
        }
      }
    }


  }
//
//     stage('deploy to production') {
//       steps {
//         input(id: 'deploy-to-production', message: 'deploy to production?')
//         kubernetesDeploy(configs: 'deploy/prod-ol/**', enableConfigSubstitution: true, kubeconfigId: "$KUBECONFIG_CREDENTIAL_ID")
//       }
//     }
}

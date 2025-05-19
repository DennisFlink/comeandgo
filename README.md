# comeandgovariables:
   IMAGE_NAME: comeandgo-web
   IMAGE_GROUP: utforskande/comeandgo
   DOCKER_DRIVER: overlay2
   IMAGE_TAG: '$CI_COMMIT_SHA'

before_script:
   - apk update && apk add git
   - git config --global user.name "CI/CD Bot"
   - git config --global user.email "cicd-bot@git.vgregion.se"
   - git config pull.rebase false

stages: # List of stages for jobs, and their order of execution
   - sync
   - build
   - containerize

build-job: # This job runs in the build stage, which runs first.
   stage: build

   #image: maven:3.8.1-jdk-17

   script:
      - echo "Compiling the code..."
      #  - mvn clean install -DskipTests
      - echo "Compile complete."
   except:
      - schedules

sync_with_github:
   stage: sync
   script:
      - echo $CI_REPOSITORY_URL
      #https://oauth2:$ACCESS_TOKEN@
      - git remote add gitlab https://gitlab-ci-token:${SERVICE_ACCOUNT_TOKEN}@${REPOSITORY_URL}
      - git fetch gitlab
      - git fetch origin
      - git checkout main || git checkout -b main
      - git pull gitlab main
      - git pull origin master --allow-unrelated-histories
      - git merge origin/master
      - git push gitlab main

   only:
      - schedules

build-push-oci-job:
   stage: containerize
   tags:
      - shared-dind
   image: docker:20.10.24
   services:
      - docker:20.10.24-dind
   before_script:
      - echo "$HARBOR_PASSWORD" | docker login -u "$HARBOR_USER" --password-stdin $HARBOR_URL
      - echo "logged in to harbor"
   script:
      - docker build -t $IMAGE_NAME:$IMAGE_TAG -f kom-och-ga-web/Dockerfile kom-och-ga-web/
      - docker tag $IMAGE_NAME:$IMAGE_TAG $HARBOR_URL/$HARBOR_PROJECT/$IMAGE_GROUP/$IMAGE_NAME:$IMAGE_TAG
      - docker tag $IMAGE_NAME:$IMAGE_TAG $HARBOR_URL/$HARBOR_PROJECT/$IMAGE_GROUP/$IMAGE_NAME:latest
      - docker push $HARBOR_URL/$HARBOR_PROJECT/$IMAGE_GROUP/$IMAGE_NAME:$IMAGE_TAG
      - docker push $HARBOR_URL/$HARBOR_PROJECT/$IMAGE_GROUP/$IMAGE_NAME:latest
   rules:
      - if: '$CI_COMMIT_BRANCH == "main"'

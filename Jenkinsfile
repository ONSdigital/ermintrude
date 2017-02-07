#!groovy

node {
    stage('Checkout') {
        checkout scm
        sh 'git clean -dfx'
        sh 'git rev-parse --short HEAD > git-commit'
        sh 'set +e && (git describe --exact-match HEAD || true) > git-tag'
    }

    def branch   = env.JOB_NAME.replaceFirst('.+/', '')
    def revision = revisionFrom(readFile('git-tag').trim(), readFile('git-commit').trim())

    stage('Build') {
        sh 'npm install --no-bin-links --prefix ./src/main/web/ermintrude'
        sh "${tool 'm3'}/bin/mvn clean package dependency:copy-dependencies"
    }

    stage('Image') {
        docker.withRegistry("https://${env.ECR_REPOSITORY_URI}", { ->
            docker.build('ermintrude').push(revision)
        })
    }

    stage('Bundle') {
        sh sprintf('sed -i -e %s -e %s -e %s -e %s -e %s appspec.yml scripts/codedeploy/*', [
            "s/\\\${CODEDEPLOY_USER}/${env.CODEDEPLOY_USER}/g",
            "s/^CONFIG_BUCKET=.*/CONFIG_BUCKET=${env.S3_CONFIGURATIONS_BUCKET}/",
            "s/^ECR_REPOSITORY_URI=.*/ECR_REPOSITORY_URI=${env.ECR_REPOSITORY_URI}/",
            "s/^GIT_COMMIT=.*/GIT_COMMIT=${revision}/",
            "s/^AWS_REGION=.*/AWS_REGION=${env.AWS_DEFAULT_REGION}/",
        ])
        sh "tar -cvzf ermintrude-${revision}.tar.gz appspec.yml scripts/codedeploy"
        sh "aws s3 cp ermintrude-${revision}.tar.gz s3://${env.S3_REVISIONS_BUCKET}/"
    }

    if (branch != 'develop') return

    stage('Deploy') {
        sh sprintf('aws deploy create-deployment %s %s %s,bundleType=tgz,key=%s', [
            '--application-name ermintrude',
            "--deployment-group-name ${env.CODEDEPLOY_PUBLISHING_DEPLOYMENT_GROUP}",
            "--s3-location bucket=${env.S3_REVISIONS_BUCKET}",
            "ermintrude-${revision}.tar.gz",
        ])
    }
}

@NonCPS
def revisionFrom(tag, commit) {
    def matcher = (tag =~ /^release\/(\d+\.\d+\.\d+(?:-rc\d+)?)$/)
    matcher.matches() ? matcher[0][1] : commit
}

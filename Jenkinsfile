pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: kaniko-backend
    image: gcr.io/kaniko-project/executor:debug
    command: ["sleep"]
    args: ["9999999"]
    volumeMounts:
      - name: docker-credentials
        mountPath: /kaniko/.docker

  - name: kaniko-frontend
    image: gcr.io/kaniko-project/executor:debug
    command: ["sleep"]
    args: ["9999999"]
    volumeMounts:
      - name: docker-credentials
        mountPath: /kaniko/.docker

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["sleep"]
    args: ["9999999"]

  volumes:
    - name: docker-credentials
      secret:
        secretName: dockerhub-secret
        items:
          - key: .dockerconfigjson
            path: config.json
"""
        }
    }

    environment {
        DOCKERHUB_BACKEND  = "docker.io/abderrazekchamekh/looking-backend"
        DOCKERHUB_FRONTEND = "docker.io/abderrazekchamekh/looking-frontend"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {

       stage('Build Backend (Kaniko)') {
    steps {
        container('kaniko-backend') {
            sh """
            /kaniko/executor \
                --context=dir:///home/jenkins/agent/workspace/PI-pipeline/springLooking \
                --dockerfile=/home/jenkins/agent/workspace/PI-pipeline/springLooking/Dockerfile \
                --destination=${DOCKERHUB_BACKEND}:${IMAGE_TAG} \
                --cleanup
            """
        }
    }
}

stage('Build Frontend (Kaniko)') {
    steps {
        container('kaniko-frontend') {
            sh """
            /kaniko/executor \
                --context=dir:///home/jenkins/agent/workspace/PI-pipeline/Angular1 \
                --dockerfile=/home/jenkins/agent/workspace/PI-pipeline/Angular1/Dockerfile \
                --destination=${DOCKERHUB_FRONTEND}:${IMAGE_TAG} \
                --cleanup
            """
        }
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                        sh """
                            kubectl set image deployment/backend \
                                backend=${DOCKERHUB_BACKEND}:${IMAGE_TAG} -n app

                            kubectl set image deployment/frontend \
                                frontend=${DOCKERHUB_FRONTEND}:${IMAGE_TAG} -n app

                            kubectl rollout status deployment/backend -n app
                            kubectl rollout status deployment/frontend -n app
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful: ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
pipeline {
    agent any

    environment {
        DOCKERHUB_BACKEND  = "docker.io/abderrazekchamekh/looking-backend"
        DOCKERHUB_FRONTEND = "docker.io/abderrazekchamekh/looking-frontend"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend (Kaniko)') {
            steps {
                sh """
                /kaniko/executor \
                    --context=dir://springLooking \
                    --dockerfile=Dockerfile \
                    --destination=${DOCKERHUB_BACKEND}:${IMAGE_TAG} \
                    --cleanup
                """
            }
        }

        stage('Build Frontend (Kaniko)') {
            steps {
                sh """
                /kaniko/executor \
                    --context=dir://Angular1 \
                    --dockerfile=Dockerfile \
                    --destination=${DOCKERHUB_FRONTEND}:${IMAGE_TAG} \
                    --cleanup
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
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

    post {
        success {
            echo "✅ Deployment successful: ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
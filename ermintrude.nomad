job "ermintrude" {
  datacenters = ["eu-west-1"]
  region      = "eu"
  type        = "service"

  update {
    min_healthy_time = "30s"
    healthy_deadline = "2m"
    max_parallel     = 1
    stagger          = "150s"
  }

  group "publishing" {
    count = "{{PUBLISHING_TASK_COUNT}}"

    constraint {
      attribute = "${node.class}"
      value     = "publishing"
    }

    task "ermintrude" {
      driver = "docker"

      artifact {
        source = "s3::https://s3-eu-west-1.amazonaws.com/{{DEPLOYMENT_BUCKET}}/ermintrude/{{REVISION}}.tar.gz"
      }

      config {
        command = "${NOMAD_TASK_DIR}/start-task"

        args = [
          "java",
          "-server",
          "-Xms{{PUBLISHING_RESOURCE_HEAP_MEM}}m",
          "-Xmx{{PUBLISHING_RESOURCE_HEAP_MEM}}m",
          "-Drestolino.files=target/web",
          "-Drestolino.packageprefix=com.github.onsdigital.ermintrude.api",
          "-jar target/*-jar-with-dependencies.jar",
        ]

        image = "{{ECR_URL}}:concourse-{{REVISION}}"

        port_map {
          http = 8080
        }
      }

      service {
        name = "ermintrude"
        port = "http"
        tags = ["publishing"]
      }

      resources {
        cpu    = "{{PUBLISHING_RESOURCE_CPU}}"
        memory = "{{PUBLISHING_RESOURCE_MEM}}"

        network {
          port "http" {}
        }
      }

      template {
        source      = "${NOMAD_TASK_DIR}/vars-template"
        destination = "${NOMAD_TASK_DIR}/vars"
      }

      vault {
        policies = ["ermintrude"]
      }
    }
  }
}

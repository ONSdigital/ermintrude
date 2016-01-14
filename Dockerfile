from onsdigital/java-node-component

# Consul
WORKDIR /etc/consul.d
RUN echo '{"service": {"name": "ermintrude", "tags": ["blue"], "port": 8080, "check": {"script": "curl http://localhost:8080 >/dev/null 2>&1", "interval": "10s"}}}' > ermintrude.json

# Add the built artifact
WORKDIR /usr/src
ADD git_commit_id /usr/src/
ADD ./target/dependency/newrelic /usr/src/target/dependency/newrelic
ADD ./target/*-jar-with-dependencies.jar /usr/src/target/
ADD ./target/web /usr/src/target/web

# Set the entry point
ENTRYPOINT java -Xmx2048m \
          -javaagent:/usr/src/target/dependency/newrelic/newrelic.jar \
          -Drestolino.files="target/web" \
          -Drestolino.packageprefix=com.github.onsdigital.ermintrude.api \
          -jar target/*-jar-with-dependencies.jar
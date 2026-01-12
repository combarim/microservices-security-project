# ============================================
# Stage 1: Build
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copier les fichiers Maven
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Télécharger les dépendances (mise en cache Docker)
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copier le code source
COPY src/ src/

# Build de l'application et extraction des layers Spring Boot
RUN ./mvnw package -DskipTests -B && \
    java -Djarmode=layertools -jar target/*.jar extract

# ============================================
# Stage 2: Runtime
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

# Copier les layers extraits (optimise le cache Docker)
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

USER appuser

# Port exposé
EXPOSE 8888

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q --spider http://localhost:8888/actuator/health || exit 1

# Démarrage de l'application
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]

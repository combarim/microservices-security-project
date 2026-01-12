import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'microservices-realm',
  clientId: 'frontend-react',
});

export default keycloak;

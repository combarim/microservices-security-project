package org.example.gateway;

import org.example.gateway.config.TestSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

@SpringBootTest
@Import(TestSecurityConfig.class)
class GatewayApplicationTests {

    @MockBean
    private ReactiveJwtDecoder jwtDecoder;

    @Test
    void contextLoads() {
    }

}

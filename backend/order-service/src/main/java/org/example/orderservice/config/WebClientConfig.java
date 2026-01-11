package org.example.orderservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
                .filter(jwtPropagationFilter())
                .build();
    }

    private ExchangeFilterFunction jwtPropagationFilter() {
        return (request, next) -> {

            var authentication = SecurityContextHolder
                    .getContext()
                    .getAuthentication();

            if (authentication instanceof JwtAuthenticationToken jwtAuth) {

                String token = jwtAuth.getToken().getTokenValue();

                ClientRequest newRequest = ClientRequest
                        .from(request)
                        .header("Authorization", "Bearer " + token)
                        .build();

                return next.exchange(newRequest);
            }

            return next.exchange(request);
        };
    }
}

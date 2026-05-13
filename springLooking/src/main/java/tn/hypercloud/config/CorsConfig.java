package tn.hypercloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

   @Bean
public CorsFilter corsFilter() {
    CorsConfiguration config = new CorsConfiguration();
    
    config.addAllowedOriginPattern("http://localhost:*");
    config.addAllowedOriginPattern("http://10.0.0.153:*");
    config.addAllowedOriginPattern("http://192.168.100.*:*");
    config.addAllowedOriginPattern("http://192.168.1.*:*");  // ← ajouter
    
    config.setAllowCredentials(true);
    config.addAllowedHeader("*");
    config.addAllowedMethod("GET");
    config.addAllowedMethod("POST");
    config.addAllowedMethod("PUT");
    config.addAllowedMethod("DELETE");
    config.addAllowedMethod("OPTIONS");
    config.addExposedHeader("Content-Type");
    config.addExposedHeader("Authorization");

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return new CorsFilter(source);
}
}
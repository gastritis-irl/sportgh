package edu.codespring.sportgh.config;

import edu.codespring.sportgh.security.FirebaseAuthenticationProvider;
import edu.codespring.sportgh.security.FirebaseAuthenticationTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final FirebaseAuthenticationProvider fbAuthProvider;

    private final FirebaseAuthenticationTokenFilter fbAuthTokenFilter;

    @SuppressWarnings("PMD.SignatureDeclareThrowsException")
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
                // general restrictions
                .requestMatchers(HttpMethod.GET,
                    "/api/categories/**",
                    "/api/categories",
                    "/api/subcategories/**",
                    "/api/subcategories",
                    "/api/products/**",
                    "/api/products",
                    "/api/images/**",
                    "/api/images"
                ).permitAll()
                // users
                .requestMatchers(HttpMethod.GET, "/api/users/[0-9]+").hasRole("USER")
                // products
                .requestMatchers("/api/products/**").hasRole("USER")
                // images
                .requestMatchers("/api/images/**").hasRole("USER")
                // rent
                .requestMatchers("/api/rent/**").hasRole("USER")
                // else -> deny
                .requestMatchers("/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(fbAuthTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(fbAuthProvider);
    }
}

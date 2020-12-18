package no.digdir.krr.bekreft.kontaktinfo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

import java.util.concurrent.TimeUnit;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@RequiredArgsConstructor
@Import(SecurityProblemSupport.class)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final SecurityProblemSupport problemSupport;

    @Value("${security.contentsecuritypolicy_url}")
    private String contentsecuritypolicy_url;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .sessionManagement().sessionFixation().migrateSession()
                .and()
                .cors(withDefaults())
                .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringAntMatchers("/api/.well-known/jwks.json", "/api/.well-known/openid-configuration",
                        "/api/jwk", "/api/jwks", "/api/par", "/api/token", "/api/authorize", "/api/completeAuthorize")
                .and()
                .headers()
                .httpStrictTransportSecurity()
                .includeSubDomains(true)
                .maxAgeInSeconds(TimeUnit.DAYS.toSeconds(365))
                .and()
                .frameOptions().sameOrigin() // Set Header X-Frame-Option to SAMEORIGIN
                .contentSecurityPolicy("object-src " + contentsecuritypolicy_url + "; report-uri /csp-report-endpoint")
                .and()
                .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)
                .and()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(problemSupport)
                .accessDeniedHandler(problemSupport)
                .and()
                .authorizeRequests()
                .anyRequest().permitAll();
    }

}

package no.digdir.kontaktinfo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

import java.util.concurrent.TimeUnit;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@RequiredArgsConstructor
@EnableWebMvc
@Import(SecurityProblemSupport.class)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final SecurityProblemSupport problemSupport;
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//            .sessionManagement().sessionFixation().migrateSession()
//        .and()
//            .cors(withDefaults())
//            .csrf()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                .ignoringAntMatchers("/api/**")
//        .and()
//            .exceptionHandling()
//        .and()
//            .headers()
//            .httpStrictTransportSecurity()
//            .includeSubDomains(true)
//            .maxAgeInSeconds(TimeUnit.DAYS.toSeconds(365))
//        .and()
//            .frameOptions().sameOrigin() // Set Header X-Frame-Option to SAMEORIGIN
//            .contentSecurityPolicy("object-src https://registration.minid.digdir.no; report-uri /csp-report-endpoint")
//        .and()
//            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)
//            .and()
//        .and()
//            .exceptionHandling()
//                .authenticationEntryPoint(problemSupport)
//                .accessDeniedHandler(problemSupport)
//        .and()
//            .authorizeRequests()
//                .antMatchers("/health", "/info", "/version").permitAll()
//            .antMatchers("/api/**").authenticated()
//        .and()
//                .oauth2Login()
//        ;
//
//    }

//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//            .sessionManagement().sessionFixation().migrateSession()
//        .and()
//            .cors(withDefaults())
//            .csrf()
//                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                .ignoringAntMatchers("/api/**")
//        .and()
//            .exceptionHandling()
//        .and()
//            .headers()
//            .httpStrictTransportSecurity()
//            .includeSubDomains(true)
//            .maxAgeInSeconds(TimeUnit.DAYS.toSeconds(365))
//        .and()
//            .frameOptions().sameOrigin() // Set Header X-Frame-Option to SAMEORIGIN
//            .contentSecurityPolicy("object-src https://registration.minid.digdir.no; report-uri /csp-report-endpoint")
//        .and()
//            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)
//            .and()
//        .and()
//            .exceptionHandling()
//                .authenticationEntryPoint(problemSupport)
//                .accessDeniedHandler(problemSupport)
//        .and()
//            .authorizeRequests()
//            .antMatchers("/health", "/info", "/version").permitAll()
//            .antMatchers("/api/**").authenticated()
//        .and()
//                .oauth2Login()
//        ;
//
//    }

    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**");
    }

    public void configure(HttpSecurity http) throws Exception {
        http.csrf()
                .disable();
        http.authorizeRequests()
                .anyRequest().permitAll()
                .and()
                .headers().frameOptions().sameOrigin();
    }

}

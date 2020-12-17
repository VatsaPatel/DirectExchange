package edu.sjsu.cmpe275.config;

import edu.sjsu.cmpe275.security.*;
import edu.sjsu.cmpe275.security.jwt.JWTAuthorizationFilter;
import edu.sjsu.cmpe275.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private DirectExchangeOAuth2UserService directExchangeOAuth2UserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler successHandler;

    @Autowired
    private OAuth2AuthenticationFailureHandler failureHandler;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Bean
    public AuthorizationRequestRepository authorizationRequestRepository() {
        return new HttpSessionOAuth2AuthorizationRequestRepository();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean corsRegistrationFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
<<<<<<< Updated upstream
        config.addAllowedOrigin("http://ec2-34-219-184-245.us-west-2.compute.amazonaws.com:3000");
=======
        config.addAllowedOrigin("https://project-297602.wl.r.appspot.com/login");
>>>>>>> Stashed changes
        config.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET", "DELETE", "PUT"));
        config.setAllowedHeaders(Arrays.asList("X-Requested-With", "Origin", "Content-Type", "Accept", "Authorization"));
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                // If we don't set this, then spring creates JSESSIONID and authenticates using that.
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                // This will handle what we need to do when the JWT auth fails.
                .exceptionHandling()
                .authenticationEntryPoint(new AuthenticationFailureBehaviour())
                .and()
                // Bypasses the authentication requirement for these endpoints/resources
                .authorizeRequests()
                    .antMatchers("/",
                        "/error",
                        "/favicon.ico",
                        "/**/*.png",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.jpg",
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js").permitAll()
                    .and()
                // We need to disable Authentication for these login paths.
                .authorizeRequests()
                    .antMatchers("/auth/**", "/oauth2/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .oauth2Login()
                // Once the OAuth login is successful, spring security calls this handler,
                // where we are redirecting the call to the "app.redirectBaseUrl" (property in
                // application.properties) + "/oauth2/redirect?token=jwtToken"
                .successHandler(successHandler)
                // If the OAuth login is failure, spring security calls this handler,
                // where we are redirecting the call to the "app.redirectBaseUrl" (property in
                // application.properties) + "/oauth2/redirect?error=jwtToken"
                .failureHandler(failureHandler)
                .and()
                // This filter is added to spring security to validate JWT token in "Bearer" token
                .addFilter(new JWTAuthorizationFilter(authenticationManager(), jwtTokenProvider));
    }
}

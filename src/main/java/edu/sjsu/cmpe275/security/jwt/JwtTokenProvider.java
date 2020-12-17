package edu.sjsu.cmpe275.security.jwt;

import edu.sjsu.cmpe275.config.AppConfig;
import edu.sjsu.cmpe275.dao.User;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class JwtTokenProvider {


    private AppConfig appConfig;

    public JwtTokenProvider(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    public String createToken(User user) {
       return createToken(Long.toString(user.getUserId()), user.getNickName());
    }

    public String createToken(String userId, String nickName) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appConfig.getJwtProps().getTokenExpirationMsec());

        Map<String, Object> claims = new HashMap<>();
        claims.put("nickName", nickName);
        claims.put("sub", userId);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appConfig.getJwtProps().getTokenSecret())
                .compact();
    }

    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(appConfig.getJwtProps().getTokenSecret())
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(appConfig.getJwtProps().getTokenSecret()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }

}

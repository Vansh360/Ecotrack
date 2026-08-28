package com.ecotrack.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration:86400000}") long expiration
    ) {

        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 characters long"
            );
        }

        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }


    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            Long userId,
            String email
    ) {

        Date now = new Date();

        Date expiry = new Date(
                now.getTime() + expiration
        );

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }


    // ==========================================
    // EXTRACT EMAIL
    // ==========================================

    public String extractEmail(String token) {

        return getClaims(token)
                .getSubject();
    }


    // ==========================================
    // EXTRACT USER ID
    // ==========================================

    public Long extractUserId(String token) {

        return getClaims(token)
                .get("userId", Long.class);
    }


    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isValid(String token) {

        try {

            getClaims(token);

            return true;

        } catch (Exception e) {

            System.out.println(
                    "JWT validation error: "
                            + e.getMessage()
            );

            return false;
        }
    }


    // ==========================================
    // VALIDATE TOKEN + EMAIL
    // ==========================================

    public boolean valid(
            String token,
            String email
    ) {

        try {

            String tokenEmail =
                    extractEmail(token);

            return tokenEmail != null
                    && tokenEmail.equalsIgnoreCase(email)
                    && isValid(token);

        } catch (Exception e) {

            return false;
        }
    }


    // ==========================================
    // PARSE JWT
    // ==========================================

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
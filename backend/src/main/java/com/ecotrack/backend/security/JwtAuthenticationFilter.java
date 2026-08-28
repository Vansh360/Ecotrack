package com.ecotrack.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwt;

    public JwtAuthenticationFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        // No Authorization header
        if (
                authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        String token =
                authorizationHeader.substring(7).trim();

        try {

            // ==========================
            // VALIDATE TOKEN
            // ==========================

            if (!jwt.isValid(token)) {

                System.out.println(
                        "JWT rejected: invalid or expired token"
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            // ==========================
            // GET EMAIL
            // ==========================

            String email =
                    jwt.extractEmail(token);


            // ==========================
            // CREATE AUTHENTICATION
            // ==========================

            if (
                    email != null &&
                    !email.isBlank() &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null
            ) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.emptyList()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

                System.out.println(
                        "JWT authenticated user: "
                                + email
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT authentication failed: "
                            + e.getMessage()
            );
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}
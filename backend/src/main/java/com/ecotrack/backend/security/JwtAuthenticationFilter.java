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

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService jwt;


    public JwtAuthenticationFilter(
            JwtService jwt
    ) {

        this.jwt = jwt;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {


        String authorizationHeader =
                request.getHeader(
                        "Authorization"
                );


        String token = null;

        String email = null;


        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (
                authorizationHeader != null
                        &&
                authorizationHeader.startsWith(
                        "Bearer "
                )
        ) {

            token =
                    authorizationHeader.substring(
                            7
                    );

            try {

                email =
                        jwt.extractEmail(
                                token
                        );

            } catch (Exception e) {

                email = null;
            }
        }


        // ==========================================
        // AUTHENTICATE USER
        // ==========================================

        if (
                email != null
                        &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        == null
        ) {

            if (
                    jwt.valid(
                            token,
                            email
                    )
            ) {

                UsernamePasswordAuthenticationToken
                        authentication =

                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                java.util.Collections.emptyList()
                        );


                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(
                                        request
                                )
                );


                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}
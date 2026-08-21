package com.ecotrack.backend.security;
import jakarta.servlet.*; import jakarta.servlet.http.*; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.security.core.userdetails.UserDetailsService; import org.springframework.stereotype.Component; import org.springframework.web.filter.OncePerRequestFilter; import java.io.IOException;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{
 private final JwtService jwt; private final UserDetailsService uds;
 public JwtAuthenticationFilter(JwtService jwt,UserDetailsService uds){this.jwt=jwt;this.uds=uds;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
   String h=req.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer ")){String token=h.substring(7);try{String email=jwt.extractEmail(token); if(SecurityContextHolder.getContext().getAuthentication()==null){var u=uds.loadUserByUsername(email);if(jwt.valid(token,email))SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(u,null,u.getAuthorities()));}}catch(Exception ignored){}}
   chain.doFilter(req,res);
 }
}

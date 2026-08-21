package com.ecotrack.backend.auth;
import com.ecotrack.backend.security.JwtService; import com.ecotrack.backend.user.User; import com.ecotrack.backend.user.UserRepository; import org.springframework.security.authentication.AuthenticationManager; import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service; import org.springframework.web.server.ResponseStatusException; import org.springframework.http.HttpStatus;
@Service public class AuthService{
 private final UserRepository repo; private final PasswordEncoder encoder; private final AuthenticationManager auth; private final JwtService jwt;
 public AuthService(UserRepository repo,PasswordEncoder encoder,AuthenticationManager auth,JwtService jwt){this.repo=repo;this.encoder=encoder;this.auth=auth;this.jwt=jwt;}
 public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest r){if(repo.existsByEmailIgnoreCase(r.email()))throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already registered"); User u=new User();u.setName(r.name());u.setEmail(r.email().toLowerCase());u.setPassword(encoder.encode(r.password()));u.setRole("USER");repo.save(u);return response(u);}
 public AuthDtos.AuthResponse login(AuthDtos.LoginRequest r){auth.authenticate(new UsernamePasswordAuthenticationToken(r.email(),r.password()));return response(repo.findByEmailIgnoreCase(r.email()).orElseThrow());}
 private AuthDtos.AuthResponse response(User u){return new AuthDtos.AuthResponse(jwt.generate(u.getEmail(),u.getRole()),u.getId(),u.getName(),u.getEmail(),u.getRole());}
}

package com.ecotrack.backend.user;
import jakarta.validation.constraints.*; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/users") public class UserController{
 private final UserRepository repo; public UserController(UserRepository repo){this.repo=repo;}
 public record ProfileRequest(@NotBlank String name,String city,@Min(1) Integer householdSize,String vehicleType,String dietType,String preferredTransport){}
 @GetMapping("/me") public User me(){return current();}
 @PutMapping("/me") public User update(@RequestBody ProfileRequest r){User u=current();u.setName(r.name());u.setCity(r.city());u.setHouseholdSize(r.householdSize());u.setVehicleType(r.vehicleType());u.setDietType(r.dietType());u.setPreferredTransport(r.preferredTransport());return repo.save(u);}
 private User current(){String email=SecurityContextHolder.getContext().getAuthentication().getName();return repo.findByEmailIgnoreCase(email).orElseThrow();}
}

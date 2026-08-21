package com.ecotrack.backend.activity;
import jakarta.validation.Valid; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/activities") public class ActivityController{
 private final ActivityService service; public ActivityController(ActivityService s){service=s;} private String email(){return SecurityContextHolder.getContext().getAuthentication().getName();}
 @PostMapping public ActivityDtos.ActivityResponse create(@Valid @RequestBody ActivityDtos.CreateActivityRequest r){return service.create(email(),r);} @GetMapping public List<ActivityDtos.ActivityResponse> list(){return service.list(email());} @GetMapping("/{id}") public ActivityDtos.ActivityResponse get(@PathVariable Long id){return service.get(email(),id);} @DeleteMapping("/{id}") public void delete(@PathVariable Long id){service.delete(email(),id);}
}

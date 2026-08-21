package com.ecotrack.backend.activity;
import jakarta.validation.Valid; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.web.bind.annotation.*; import java.time.LocalDate; import java.util.*;
@RestController public class CategoryActivityController{
 private final ActivityService service; public CategoryActivityController(ActivityService s){service=s;} private String email(){return SecurityContextHolder.getContext().getAuthentication().getName();}
 private ActivityDtos.ActivityResponse create(String category, String type, double quantity,String unit,LocalDate date,String metadata){return service.create(email(),new ActivityDtos.CreateActivityRequest(category,type,quantity,unit,date,metadata));}
 @PostMapping("/api/transportation") public ActivityDtos.ActivityResponse transportation(@Valid @RequestBody CategoryRequest r){return create("TRANSPORTATION",r.activityType(),r.quantity(),r.unit(),r.activityDate(),r.metadata());}
 @PostMapping("/api/electricity") public ActivityDtos.ActivityResponse electricity(@Valid @RequestBody CategoryRequest r){return create("ELECTRICITY",r.activityType(),r.quantity(),r.unit(),r.activityDate(),r.metadata());}
 @PostMapping("/api/food") public ActivityDtos.ActivityResponse food(@Valid @RequestBody CategoryRequest r){return create("FOOD",r.activityType(),r.quantity(),r.unit(),r.activityDate(),r.metadata());}
 @PostMapping("/api/waste") public ActivityDtos.ActivityResponse waste(@Valid @RequestBody CategoryRequest r){return create("WASTE",r.activityType(),r.quantity(),r.unit(),r.activityDate(),r.metadata());}
 @PostMapping("/api/water") public ActivityDtos.ActivityResponse water(@Valid @RequestBody CategoryRequest r){return create("WATER",r.activityType(),r.quantity(),r.unit(),r.activityDate(),r.metadata());}
 public record CategoryRequest(@jakarta.validation.constraints.NotBlank String activityType,@jakarta.validation.constraints.Positive double quantity,@jakarta.validation.constraints.NotBlank String unit,@jakarta.validation.constraints.NotNull LocalDate activityDate,String metadata){}
}

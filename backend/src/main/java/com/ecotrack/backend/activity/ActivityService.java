package com.ecotrack.backend.activity;
import com.ecotrack.backend.emission.*; import com.ecotrack.backend.user.*; import org.springframework.http.HttpStatus; import org.springframework.stereotype.Service; import org.springframework.web.server.ResponseStatusException; import java.util.*;
@Service public class ActivityService{
 private final ActivityRepository activities; private final EmissionFactorRepository factors; private final UserRepository users;
 public ActivityService(ActivityRepository a,EmissionFactorRepository f,UserRepository u){activities=a;factors=f;users=u;}
 public ActivityDtos.ActivityResponse create(String email,ActivityDtos.CreateActivityRequest r){User u=users.findByEmailIgnoreCase(email).orElseThrow();String cat=r.category().toUpperCase();String type=r.activityType().toUpperCase();EmissionFactor f=factors.findFirstByCategoryAndActivityTypeAndActiveTrueOrderByIdDesc(cat,type).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"No active emission factor for "+cat+"/"+type));Activity a=new Activity();a.setUser(u);a.setCategory(cat);a.setActivityType(type);a.setQuantity(r.quantity());a.setUnit(r.unit());a.setActivityDate(r.activityDate());a.setMetadata(r.metadata());a.setEmission(r.quantity()*f.getFactor());a.setEmissionFactor(f);a.setEmissionFactorVersion(f.getVersion());activities.save(a);return toResponse(a);}
 public List<ActivityDtos.ActivityResponse> list(String email){Long id=users.findByEmailIgnoreCase(email).orElseThrow().getId();return activities.findByUserIdOrderByActivityDateDesc(id).stream().map(this::toResponse).toList();}
 public ActivityDtos.ActivityResponse get(String email,Long id){Long uid=users.findByEmailIgnoreCase(email).orElseThrow().getId();Activity a=activities.findById(id).filter(x->x.getUser().getId().equals(uid)).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Activity not found"));return toResponse(a);}
 public void delete(String email,Long id){Long uid=users.findByEmailIgnoreCase(email).orElseThrow().getId();Activity a=activities.findById(id).filter(x->x.getUser().getId().equals(uid)).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Activity not found"));activities.delete(a);}
 private ActivityDtos.ActivityResponse toResponse(Activity a){
	return new ActivityDtos.ActivityResponse(
	 a.getId(),a.getCategory(),a.getActivityType(),a.getQuantity(),a.getUnit(),a.getEmission(),a.getActivityDate(),a.getEmissionFactorVersion());
 }
}

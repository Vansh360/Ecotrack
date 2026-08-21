package com.ecotrack.backend.analytics;
import com.ecotrack.backend.activity.ActivityRepository; import com.ecotrack.backend.user.UserRepository; import org.springframework.stereotype.Service; import java.time.*; import java.util.*;
@Service public class AnalyticsService{
 private final ActivityRepository repo; private final UserRepository users; public AnalyticsService(ActivityRepository r,UserRepository u){repo=r;users=u;}
 public Map<String,Object> dashboard(String email){Long uid=users.findByEmailIgnoreCase(email).orElseThrow().getId();LocalDate now=LocalDate.now();double today=repo.total(uid,now,now),week=repo.total(uid,now.minusDays(6),now),month=repo.total(uid,now.withDayOfMonth(1),now),year=repo.total(uid,now.withDayOfYear(1),now);return Map.of("today",today,"thisWeek",week,"thisMonth",month,"thisYear",year,"sustainabilityScore",score(uid),"categoryTotals",category(uid,now.withDayOfMonth(1),now));}
 public Map<String,Double> category(Long uid,LocalDate from,LocalDate to){Map<String,Double> m=new LinkedHashMap<>();repo.byCategory(uid,from,to).forEach(x->m.put((String)x[0],((Number)x[1]).doubleValue()));return m;}
 public List<Map<String,Object>> daily(String email,LocalDate from,LocalDate to){Long uid=users.findByEmailIgnoreCase(email).orElseThrow().getId();return repo.daily(uid,from,to).stream().map(x->Map.of("date",x[0],"emission",x[1])).toList();}
 public double score(Long uid){LocalDate now=LocalDate.now();double m=repo.total(uid,now.withDayOfMonth(1),now);if(m==0)return 100;double score=100-(m/500.0*100);return Math.max(0,Math.min(100,Math.round(score*10)/10.0));}
}

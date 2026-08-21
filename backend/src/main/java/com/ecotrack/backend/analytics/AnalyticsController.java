package com.ecotrack.backend.analytics;
import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.web.bind.annotation.*; import java.time.LocalDate; import java.util.*;
@RestController @RequestMapping("/api/analytics") public class AnalyticsController{
 private final AnalyticsService s; public AnalyticsController(AnalyticsService s){this.s=s;} private String email(){return SecurityContextHolder.getContext().getAuthentication().getName();}
 @GetMapping("/dashboard") public Map<String,Object> dashboard(){return s.dashboard(email());}
 @GetMapping("/daily") public List<Map<String,Object>> daily(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to){LocalDate end=to==null?LocalDate.now():to;LocalDate start=from==null?end.minusDays(29):from;return s.daily(email(),start,end);}
 @GetMapping("/weekly") public List<Map<String,Object>> weekly(){LocalDate end=LocalDate.now();List<Map<String,Object>> out=new ArrayList<>();for(int i=7;i>=0;i--){LocalDate d=end.minusWeeks(i);out.add(Map.of("week",d,"emission",s.daily(email(),d.minusDays(6),d).stream().mapToDouble(x->((Number)x.get("emission")).doubleValue()).sum()));}return out;}
 @GetMapping("/monthly") public List<Map<String,Object>> monthly(){LocalDate end=LocalDate.now();List<Map<String,Object>> out=new ArrayList<>();for(int i=11;i>=0;i--){LocalDate m=end.minusMonths(i).withDayOfMonth(1);LocalDate e=m.withDayOfMonth(m.lengthOfMonth());double total=s.daily(email(),m,e).stream().mapToDouble(x->((Number)x.get("emission")).doubleValue()).sum();out.add(Map.of("month",m,"emission",total));}return out;}
 @GetMapping("/categories") public Map<String,Double> categories(){return s.dashboard(email()).get("categoryTotals") instanceof Map<?,?> m ? m.entrySet().stream().collect(java.util.stream.Collectors.toMap(e->String.valueOf(e.getKey()),e->((Number)e.getValue()).doubleValue(),(a,b)->b,LinkedHashMap::new)) : Map.of();}
}

package com.ecotrack.backend.exception;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import org.springframework.web.server.ResponseStatusException; import java.time.Instant; import java.util.*;
@RestControllerAdvice public class GlobalExceptionHandler{
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){Map<String,Object> m=new LinkedHashMap<>();m.put("timestamp",Instant.now());m.put("status",400);m.put("message","Validation failed");m.put("errors",e.getBindingResult().getFieldErrors().stream().collect(java.util.stream.Collectors.toMap(x->x.getField(),x->x.getDefaultMessage(),(a,b)->a)));return ResponseEntity.badRequest().body(m);}
 @ExceptionHandler(ResponseStatusException.class) ResponseEntity<?> status(ResponseStatusException e){return ResponseEntity.status(e.getStatusCode()).body(Map.of("timestamp",Instant.now(),"status",e.getStatusCode().value(),"message",e.getReason()==null?"Request failed":e.getReason()));}
 @ExceptionHandler(Exception.class) ResponseEntity<?> other(Exception e){e.printStackTrace();return ResponseEntity.status(500).body(Map.of("timestamp",Instant.now(),"status",500,"message","Internal server error"));}
}

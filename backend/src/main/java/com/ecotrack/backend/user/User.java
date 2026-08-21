package com.ecotrack.backend.user;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;

@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @JsonIgnore @Column(nullable=false) private String password;
    @Column(nullable=false) private String role="USER";
    private String city; private Integer householdSize; private String vehicleType; private String dietType; private String preferredTransport;
    @Column(nullable=false) private Instant createdAt=Instant.now();
    @Column(nullable=false) private Instant updatedAt=Instant.now();
    public Long getId(){return id;} public String getName(){return name;} public void setName(String v){name=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPassword(){return password;} public void setPassword(String v){password=v;} public String getRole(){return role;} public void setRole(String v){role=v;} public String getCity(){return city;} public void setCity(String v){city=v;} public Integer getHouseholdSize(){return householdSize;} public void setHouseholdSize(Integer v){householdSize=v;} public String getVehicleType(){return vehicleType;} public void setVehicleType(String v){vehicleType=v;} public String getDietType(){return dietType;} public void setDietType(String v){dietType=v;} public String getPreferredTransport(){return preferredTransport;} public void setPreferredTransport(String v){preferredTransport=v;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
    @PreUpdate public void touch(){updatedAt=Instant.now();}
}

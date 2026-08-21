package com.ecotrack.backend.emission;
import jakarta.persistence.*; import java.time.LocalDate;
@Entity @Table(name="emission_factors") public class EmissionFactor{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @Column(nullable=false) String category; @Column(nullable=false) String activityType; @Column(nullable=false) double factor; @Column(nullable=false) String unit; String source; String region; @Column(nullable=false) String version="1.0"; LocalDate validFrom,validTo; boolean active=true;
 public Long getId(){return id;} public String getCategory(){return category;} public void setCategory(String v){category=v;} public String getActivityType(){return activityType;} public void setActivityType(String v){activityType=v;} public double getFactor(){return factor;} public void setFactor(double v){factor=v;} public String getUnit(){return unit;} public void setUnit(String v){unit=v;} public String getSource(){return source;} public void setSource(String v){source=v;} public String getRegion(){return region;} public void setRegion(String v){region=v;} public String getVersion(){return version;} public void setVersion(String v){version=v;} public LocalDate getValidFrom(){return validFrom;} public void setValidFrom(LocalDate v){validFrom=v;} public LocalDate getValidTo(){return validTo;} public void setValidTo(LocalDate v){validTo=v;} public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}



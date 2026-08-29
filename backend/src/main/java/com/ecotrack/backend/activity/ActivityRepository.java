package com.ecotrack.backend.activity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;

public interface ActivityRepository
        extends JpaRepository<Activity, Long> {


    // =====================================================
    // BASIC ACTIVITY QUERIES
    // =====================================================

    List<Activity> findAllByOrderByActivityDateDesc();


    List<Activity> findByUserOrderByActivityDateDesc(
            User user
    );


    List<Activity> findByUserAndActivityDateBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );


    List<Activity> findByUserAndCategory(
            User user,
            String category
    );


    // =====================================================
    // TOTAL EMISSION
    // =====================================================

    @Query("""
        SELECT COALESCE(SUM(a.emission), 0)
        FROM Activity a
        WHERE a.user.id = :userId
        AND a.activityDate >= :start
        AND a.activityDate < :end
    """)
    Double totalBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    /*
     * Existing services use:
     *
     * total(userId, startDate, endDate)
     *
     * These default methods convert LocalDate
     * into LocalDateTime values.
     */

    default Double total(
            Long userId,
            LocalDate start,
            LocalDate end
    ) {

        return totalBetween(
                userId,
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );
    }


    // =====================================================
    // CATEGORY ANALYTICS
    // =====================================================

    @Query("""
        SELECT a.category,
               COALESCE(SUM(a.emission), 0)
        FROM Activity a
        WHERE a.user.id = :userId
        AND a.activityDate >= :start
        AND a.activityDate < :end
        GROUP BY a.category
        ORDER BY SUM(a.emission) DESC
    """)
    List<Object[]> byCategoryBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    default List<Object[]> byCategory(
            Long userId,
            LocalDate start,
            LocalDate end
    ) {

        return byCategoryBetween(
                userId,
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );
    }


    // =====================================================
    // DAILY ANALYTICS
    // =====================================================

    @Query("""
        SELECT FUNCTION('DATE', a.activityDate),
               COALESCE(SUM(a.emission), 0)
        FROM Activity a
        WHERE a.user.id = :userId
        AND a.activityDate >= :start
        AND a.activityDate < :end
        GROUP BY FUNCTION('DATE', a.activityDate)
        ORDER BY FUNCTION('DATE', a.activityDate)
    """)
    List<Object[]> dailyBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    default List<Object[]> daily(
            Long userId,
            LocalDate start,
            LocalDate end
    ) {

        return dailyBetween(
                userId,
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );
    }


    // =====================================================
    // GAMIFICATION
    // =====================================================

    @Query("""
        SELECT COUNT(a)
        FROM Activity a
        WHERE a.user.id = :userId
    """)
    long countByUserId(
            @Param("userId") Long userId
    );


    @Query("""
        SELECT COUNT(a)
        FROM Activity a
        WHERE a.user.id = :userId
        AND LOWER(a.category) = LOWER(:category)
    """)
    long countByUserIdAndCategory(
            @Param("userId") Long userId,
            @Param("category") String category
    );
}
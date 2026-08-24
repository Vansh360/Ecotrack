package com.ecotrack.backend.activity;

import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ActivityRepository
        extends JpaRepository<Activity, Long> {


    // =====================================================
    // BASIC ACTIVITY QUERIES
    // =====================================================

    List<Activity> findAllByOrderByDateDesc();


    List<Activity> findByUserOrderByDateDesc(
            User user
    );


    List<Activity> findByUserAndDateBetween(
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
        AND a.date >= :start
        AND a.date < :end
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
     * into the LocalDateTime values required
     * by the database query.
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
        SELECT a.category, COALESCE(SUM(a.emission), 0)
        FROM Activity a
        WHERE a.user.id = :userId
        AND a.date >= :start
        AND a.date < :end
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
        SELECT FUNCTION('DATE', a.date),
               COALESCE(SUM(a.emission), 0)
        FROM Activity a
        WHERE a.user.id = :userId
        AND a.date >= :start
        AND a.date < :end
        GROUP BY FUNCTION('DATE', a.date)
        ORDER BY FUNCTION('DATE', a.date)
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
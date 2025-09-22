package com.hostel.complaint.repository;

import com.hostel.complaint.entity.Complaint;
import com.hostel.complaint.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    List<Complaint> findByUser(User user);
    
    List<Complaint> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Complaint> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Complaint> findByStatus(Complaint.Status status);
    
    Page<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.Status status, Pageable pageable);
    
    List<Complaint> findByPriority(Complaint.Priority priority);
    
    List<Complaint> findByCategory(String category);
    
    List<Complaint> findByBlock(String block);
    
    @Query("SELECT c FROM Complaint c WHERE c.status = :status AND c.priority = :priority ORDER BY c.createdAt DESC")
    List<Complaint> findByStatusAndPriority(@Param("status") Complaint.Status status, 
                                          @Param("priority") Complaint.Priority priority);
    
    @Query("SELECT c FROM Complaint c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:block IS NULL OR c.block = :block) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    Page<Complaint> findComplaintsWithFilters(@Param("category") String category,
                                            @Param("status") Complaint.Status status,
                                            @Param("priority") Complaint.Priority priority,
                                            @Param("block") String block,
                                            @Param("search") String search,
                                            Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = :status")
    long countByStatus(@Param("status") Complaint.Status status);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.priority = :priority")
    long countByPriority(@Param("priority") Complaint.Priority priority);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.user = :user")
    long countByUser(@Param("user") User user);
    
    @Query("SELECT c FROM Complaint c WHERE c.createdAt BETWEEN :startDate AND :endDate ORDER BY c.createdAt DESC")
    List<Complaint> findComplaintsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> getComplaintCountByCategory();
    
    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> getComplaintCountByStatus();
    
    @Query("SELECT c.priority, COUNT(c) FROM Complaint c GROUP BY c.priority")
    List<Object[]> getComplaintCountByPriority();
}

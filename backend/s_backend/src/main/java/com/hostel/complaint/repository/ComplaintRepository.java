package com.hostel.complaint.repository;

import com.hostel.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    List<Complaint> findByStudentId(Long studentId);
    
    List<Complaint> findByStatus(Complaint.Status status);
    
    List<Complaint> findByCategory(Complaint.Category category);
    
    List<Complaint> findByAssignedToAdminId(Long adminId);
    
    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    
    List<Complaint> findAllByOrderByCreatedAtDesc();
}

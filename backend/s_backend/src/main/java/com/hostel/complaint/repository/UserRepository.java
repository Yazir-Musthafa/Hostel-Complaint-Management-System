package com.hostel.complaint.repository;

import com.hostel.complaint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByFirebaseUid(String firebaseUid);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByParentId(Long parentId);
    
    List<User> findByStudentId(Long studentId);
    
    boolean existsByEmail(String email);
    
    boolean existsByFirebaseUid(String firebaseUid);
}

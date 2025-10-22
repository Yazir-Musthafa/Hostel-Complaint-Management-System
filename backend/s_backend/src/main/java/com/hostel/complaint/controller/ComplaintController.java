package com.hostel.complaint.controller;

import com.hostel.complaint.entity.Complaint;
import com.hostel.complaint.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        return complaintService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Complaint>> getComplaintsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(complaintService.getComplaintsByStudentId(studentId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getComplaintsByStatus(@PathVariable String status) {
        Complaint.Status complaintStatus = Complaint.Status.valueOf(status.toUpperCase());
        return ResponseEntity.ok(complaintService.getComplaintsByStatus(complaintStatus));
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getComplaintsByCategory(@PathVariable String category) {
        Complaint.Category complaintCategory = Complaint.Category.valueOf(category.toUpperCase());
        return ResponseEntity.ok(complaintService.getComplaintsByCategory(complaintCategory));
    }

    @GetMapping("/admin/{adminId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getComplaintsByAdminId(@PathVariable Long adminId) {
        return ResponseEntity.ok(complaintService.getComplaintsByAdminId(adminId));
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(@RequestBody Complaint complaint) {
        try {
            Complaint createdComplaint = complaintService.createComplaint(complaint);
            return ResponseEntity.ok(createdComplaint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComplaint(@PathVariable Long id, @RequestBody Complaint complaint) {
        try {
            Complaint updatedComplaint = complaintService.updateComplaint(id, complaint);
            return ResponseEntity.ok(updatedComplaint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long id, 
                                                   @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            String adminResponse = statusUpdate.get("adminResponse");
            Complaint.Status complaintStatus = Complaint.Status.valueOf(status.toUpperCase());
            Complaint updatedComplaint = complaintService.updateComplaintStatus(id, complaintStatus, adminResponse);
            return ResponseEntity.ok(updatedComplaint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        try {
            complaintService.deleteComplaint(id);
            return ResponseEntity.ok(Map.of("message", "Complaint deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getComplaintStats() {
        Map<String, Object> stats = Map.of(
                "total", complaintService.getTotalComplaints(),
                "pending", complaintService.getPendingComplaints(),
                "resolved", complaintService.getResolvedComplaints()
        );
        return ResponseEntity.ok(stats);
    }
}

package com.hostel.complaint.service;

import com.hostel.complaint.entity.Complaint;
import com.hostel.complaint.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint createComplaint(Complaint complaint) {
        complaint.setStatus(Complaint.Status.PENDING);
        return complaintRepository.save(complaint);
    }

    public Optional<Complaint> findById(Long id) {
        return complaintRepository.findById(id);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Complaint> getComplaintsByStudentId(Long studentId) {
        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Complaint> getComplaintsByStatus(Complaint.Status status) {
        return complaintRepository.findByStatus(status);
    }

    public List<Complaint> getComplaintsByCategory(Complaint.Category category) {
        return complaintRepository.findByCategory(category);
    }

    public List<Complaint> getComplaintsByAdminId(Long adminId) {
        return complaintRepository.findByAssignedToAdminId(adminId);
    }

    public Complaint updateComplaint(Long id, Complaint complaintDetails) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (complaintDetails.getTitle() != null) {
            complaint.setTitle(complaintDetails.getTitle());
        }
        if (complaintDetails.getDescription() != null) {
            complaint.setDescription(complaintDetails.getDescription());
        }
        if (complaintDetails.getCategory() != null) {
            complaint.setCategory(complaintDetails.getCategory());
        }
        if (complaintDetails.getPriority() != null) {
            complaint.setPriority(complaintDetails.getPriority());
        }
        if (complaintDetails.getStatus() != null) {
            complaint.setStatus(complaintDetails.getStatus());
        }
        if (complaintDetails.getAssignedToAdminId() != null) {
            complaint.setAssignedToAdminId(complaintDetails.getAssignedToAdminId());
        }
        if (complaintDetails.getAdminResponse() != null) {
            complaint.setAdminResponse(complaintDetails.getAdminResponse());
        }

        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaintStatus(Long id, Complaint.Status status, String adminResponse) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        if (adminResponse != null) {
            complaint.setAdminResponse(adminResponse);
        }

        return complaintRepository.save(complaint);
    }

    public void deleteComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaintRepository.delete(complaint);
    }

    public long getTotalComplaints() {
        return complaintRepository.count();
    }

    public long getPendingComplaints() {
        return complaintRepository.findByStatus(Complaint.Status.PENDING).size();
    }

    public long getResolvedComplaints() {
        return complaintRepository.findByStatus(Complaint.Status.RESOLVED).size();
    }
}

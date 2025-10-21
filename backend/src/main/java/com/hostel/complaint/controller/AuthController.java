package com.hostel.complaint.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.WriteResult;
import com.hostel.complaint.entity.Student;
import com.hostel.complaint.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private FirebaseAuth firebaseAuth;

    @Autowired
    private Firestore firestore;

    // ------------------ Registration ------------------
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserRecord firebaseUser = null;
            String uid = request.getFirebaseUid();

            if (uid == null || uid.isEmpty()) {
                UserRecord.CreateRequest createRequest = new UserRecord.CreateRequest()
                        .setEmail(request.getEmail())
                        .setEmailVerified(true)
                        .setPassword(request.getPassword())
                        .setDisplayName(request.getName());
                firebaseUser = firebaseAuth.createUser(createRequest);
                uid = firebaseUser.getUid();
            } else {
                firebaseUser = firebaseAuth.getUser(uid);
            }

            // ----------------------------
            // Create Student object immediately
            // ----------------------------
            Student newStudent = new Student(
                    uid,
                    request.getName(),
                    request.getEmail(),
                    request.getStudentId(),
                    request.getRoomNumber(),
                    request.getBlock()
            );
            newStudent.setMobile(request.getMobile());
            newStudent.setActive(true);

            // ----------------------------
            // Save to Firestore
            // ----------------------------
            Map<String, Object> userDocData = new HashMap<>();
            userDocData.put("uid", uid);
            userDocData.put("name", newStudent.getName());
            userDocData.put("email", newStudent.getEmail());
            userDocData.put("mobile", newStudent.getMobile());
            userDocData.put("studentId", newStudent.getStudentId());
            userDocData.put("roomNumber", newStudent.getRoom());
            userDocData.put("block", newStudent.getBlock());
            userDocData.put("role", "student");
            userDocData.put("active", true);
            userDocData.put("createdAt", Instant.now().toString());
            userDocData.put("updatedAt", Instant.now().toString());

            DocumentReference docRef = firestore.collection("users").document(uid);
            WriteResult result = docRef.set(userDocData).get();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful! User details stored in database.");
            response.put("user", Map.of(
                    "uid", uid,
                    "name", newStudent.getName(),
                    "email", newStudent.getEmail(),
                    "mobile", newStudent.getMobile(),
                    "studentId", newStudent.getStudentId(),
                    "roomNumber", newStudent.getRoom(),
                    "block", newStudent.getBlock(),
                    "role", "student",
                    "active", true
            ));

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            String errorMessage = "Registration failed";
            if (e.getErrorCode() != null) {
                switch (e.getErrorCode().name()) {
                    case "EMAIL_ALREADY_EXISTS":
                        errorMessage = "Email already exists. Please use a different email.";
                        break;
                    case "WEAK_PASSWORD":
                        errorMessage = "Password is too weak. Please choose a stronger password.";
                        break;
                    case "INVALID_EMAIL":
                        errorMessage = "Invalid email format.";
                        break;
                    default:
                        errorMessage = "Registration failed: " + e.getMessage();
                }
            }
            return ResponseEntity.badRequest().body(createErrorResponse(errorMessage));
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Failed to store user data: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    // ------------------ Helpers ------------------
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }

    // DTO for registration
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String mobile;
        private String studentId;
        private String roomNumber;
        private String block;
        private String firebaseUid;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }

        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

        public String getBlock() { return block; }
        public void setBlock(String block) { this.block = block; }

        public String getFirebaseUid() { return firebaseUid; }
        public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }
    }
}

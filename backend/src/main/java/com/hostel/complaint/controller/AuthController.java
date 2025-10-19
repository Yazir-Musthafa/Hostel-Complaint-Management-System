package com.hostel.complaint.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.hostel.complaint.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private FirebaseAuth firebaseAuth;


    // Login endpoint - Handles admin login with static credentials
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Admin login logic
            if ("admin@gmail.com".equals(request.getEmail()) && "admin".equals(request.getPassword())) {
                // Use a fixed UID for the admin user for token generation
                String adminUid = "admin_user_uid";
                String customToken = firebaseAuth.createCustomToken(adminUid);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Admin login successful");
                response.put("token", customToken);
                response.put("user", Map.of(
                    "name", "Admin",
                    "email", "admin@gmail.com",
                    "role", "admin",
                    "active", true
                ));
                return ResponseEntity.ok(response);
            }

            // For students, this endpoint should not be used for password-based login from the backend.
            // The frontend should handle login with Firebase Auth SDK and send the ID token to /api/auth/login-with-token.
            // However, to maintain some compatibility if the old flow is still used, we can check.
            // A better approach is to return an error for non-admin users.
            
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid credentials"));

        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Authentication failed: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Login failed: " + e.getMessage()));
        }
    }

    // Alternative login endpoint that accepts Firebase ID token for verification
    @PostMapping("/login-with-token")
    public ResponseEntity<?> loginWithToken(@Valid @RequestBody TokenLoginRequest request) {
        try {
            // Verify the Firebase ID token
            com.google.firebase.auth.FirebaseToken decodedToken = firebaseAuth.verifyIdToken(request.getIdToken());
            String uid = decodedToken.getUid();

            // Get user info from Firebase
            UserRecord firebaseUser = firebaseAuth.getUser(uid);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", request.getIdToken());
            response.put("user", Map.of(
                "name", firebaseUser.getDisplayName(),
                "email", firebaseUser.getEmail(),
                "role", "student",
                "active", true
            ));

            return ResponseEntity.ok(response);
            
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid token: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Login failed: " + e.getMessage()));
        }
    }

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Create user in Firebase directly - Firebase will handle duplicate email errors
            UserRecord.CreateRequest createRequest = new UserRecord.CreateRequest()
                .setEmail(request.getEmail())
                .setEmailVerified(true)
                .setPassword(request.getPassword())
                .setDisplayName(request.getName());

            UserRecord firebaseUser = firebaseAuth.createUser(createRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful! You can now login with your credentials.");
            response.put("user", Map.of(
                "name", firebaseUser.getDisplayName(),
                "email", firebaseUser.getEmail(),
                "role", "student",
                "active", true
            ));

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            // Handle Firebase-specific errors
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
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    // Helper method to create error response
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }


    // DTO for login
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // DTO for token-based login
    public static class TokenLoginRequest {
        private String idToken;

        public String getIdToken() { return idToken; }
        public void setIdToken(String idToken) { this.idToken = idToken; }
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

package com.hostel.complaint.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.hostel.complaint.entity.User;
import com.hostel.complaint.service.UserService;
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

    @Autowired
    private UserService userService;

    // Login endpoint - Note: This approach requires the frontend to verify credentials with Firebase first
    // and then send the Firebase ID token to this endpoint for verification
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // For now, we'll use a simple approach where we check if user exists by email
            // In a production environment, you should verify the Firebase ID token sent from frontend
            
            Optional<User> userOptional = userService.findByEmail(request.getEmail());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found in system"));
            }
            
            User user = userOptional.get();
            
            if (!user.getActive()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User account is inactive"));
            }
            
            // Generate custom token for the user
            String customToken = firebaseAuth.createCustomToken(user.getFirebaseUid());
            
            // Create response with user data and token
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", customToken);
            response.put("user", createUserResponse(user));
            
            return ResponseEntity.ok(response);
            
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
            
            // Get user from local database
            Optional<User> userOptional = userService.findByFirebaseUid(uid);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User not found in system"));
            }
            
            User user = userOptional.get();
            
            if (!user.getActive()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User account is inactive"));
            }
            
            // Create response with user data and token
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", request.getIdToken()); // Return the same token
            response.put("user", createUserResponse(user));
            
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
            // Check if user already exists
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(createErrorResponse("User with this email already exists"));
            }
            
            // Create user in Firebase
            UserRecord.CreateRequest createRequest = new UserRecord.CreateRequest()
                    .setEmail(request.getEmail())
                    .setPassword(request.getPassword())
                    .setDisplayName(request.getName());

            UserRecord userRecord = firebaseAuth.createUser(createRequest);

            // Save user in local DB
            User user = new User();
            user.setFirebaseUid(userRecord.getUid());
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setMobile(request.getMobile());
            user.setStudentId(request.getStudentId());
            user.setRoom(request.getRoomNumber());
            user.setBlock(request.getBlock());
            user.setRole(User.Role.STUDENT); // Only students can register
            user.setActive(true);

            User savedUser = userService.save(user);
            
            // Generate custom token for immediate login
            String customToken = firebaseAuth.createCustomToken(userRecord.getUid());
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("token", customToken);
            response.put("user", createUserResponse(savedUser));
            
            return ResponseEntity.ok(response);
            
        } catch (FirebaseAuthException e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Registration failed: " + e.getMessage()));
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

    // Helper method to create user response
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("name", user.getName());
        userResponse.put("email", user.getEmail());
        userResponse.put("mobile", user.getMobile());
        userResponse.put("role", user.getRole().toString().toLowerCase());
        userResponse.put("studentId", user.getStudentId());
        userResponse.put("roomNumber", user.getRoom());
        userResponse.put("block", user.getBlock());
        userResponse.put("active", user.getActive());
        return userResponse;
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
    }
}

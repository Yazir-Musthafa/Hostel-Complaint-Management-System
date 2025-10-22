package com.hostel.complaint.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.hostel.complaint.entity.User;
import com.hostel.complaint.repository.UserRepository;
import com.hostel.complaint.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Map<String, Object> register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", sanitizeUser(savedUser));
        response.put("message", "User registered successfully");

        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", sanitizeUser(user));
        response.put("message", "Login successful");

        return response;
    }

    public Map<String, Object> loginWithFirebaseToken(String firebaseToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseToken);
            String firebaseUid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            User user = userRepository.findByFirebaseUid(firebaseUid)
                    .or(() -> userRepository.findByEmail(email))
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getFirebaseUid() == null) {
                user.setFirebaseUid(firebaseUid);
                userRepository.save(user);
            }

            String jwtToken = tokenProvider.generateTokenFromEmail(user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("user", sanitizeUser(user));
            response.put("message", "Login successful");

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Invalid Firebase token: " + e.getMessage());
        }
    }

    private Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> sanitized = new HashMap<>();
        sanitized.put("id", user.getId());
        sanitized.put("email", user.getEmail());
        sanitized.put("name", user.getName());
        sanitized.put("phoneNumber", user.getPhoneNumber());
        sanitized.put("role", user.getRole());
        sanitized.put("active", user.getActive());
        sanitized.put("parentId", user.getParentId());
        sanitized.put("studentId", user.getStudentId());
        return sanitized;
    }
}

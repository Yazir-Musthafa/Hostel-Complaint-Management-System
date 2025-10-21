package com.hostel.complaint.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

// Base interface for all user types
interface IUserActions {
    void printUserInfo();
    String getRoleName();
}

// Abstract base class
public abstract class User implements IUserActions {

    protected String firebaseUid;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    protected String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    protected String email;

    @Size(min = 10, max = 15, message = "Mobile number must be between 10 and 15 characters")
    protected String mobile;

    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;
    protected boolean active = true;

    protected Role role;

    public User() {}

    public User(String firebaseUid, String name, String email, Role role) {
        this.firebaseUid = firebaseUid;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public abstract void performRoleSpecificAction();

    // Getters and setters
    public String getFirebaseUid() { return firebaseUid; }
    public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    @Override
    public void printUserInfo() {
        System.out.println("Name: " + name + ", Email: " + email + ", Role: " + role);
    }

    @Override
    public String getRoleName() {
        return role.name();
    }

    public enum Role {
        ADMIN, STUDENT, PARENT
    }

    public enum Relationship {
        FATHER, MOTHER, GUARDIAN
    }
}

// -------------------------- Admin subclass --------------------------
class Admin extends User {

    private String adminLevel;

    public Admin(String firebaseUid, String name, String email, String adminLevel) {
        super(firebaseUid, name, email, Role.ADMIN);
        this.adminLevel = adminLevel;
    }

    public String getAdminLevel() { return adminLevel; }
    public void setAdminLevel(String adminLevel) { this.adminLevel = adminLevel; }

    @Override
    public void performRoleSpecificAction() {
        System.out.println("Admin action: Manage system settings.");
    }

    @Override
    public void printUserInfo() {
        super.printUserInfo();
        System.out.println("Admin Level: " + adminLevel);
    }
}


package com.jainam.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String contactPerson;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String gstNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    // Username of the marketing member who added this client. Null/"owner"
    // for clients added by the Owner. Used to keep each marketing member's
    // clients private from one another.
    @Column(name = "created_by")
    private String createdBy;

    // Per-client storefront login credentials. Auto-generated when the
    // client is created (see ClientService) and given to the client so
    // they can log in to the storefront themselves.
    @Column(unique = true)
    private String username;

    @Column(name = "password_hash")
    private String passwordHash;

    // Plaintext copy of the storefront password, kept so the Owner/marketing
    // dashboard can display and edit it. (Previously only a one-way hash was
    // stored and the password was shown once at creation.)
    @Column(name = "password")
    private String password;
}

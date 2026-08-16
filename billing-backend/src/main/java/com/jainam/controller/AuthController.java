package com.jainam.controller;

import com.jainam.dto.LoginRequest;
import com.jainam.dto.UserDTO;
import com.jainam.service.UserService;
import com.jainam.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private ClientService clientService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.authenticate(request.getUsername(), request.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid username or password"));
    }

    // Per-client storefront login. Each client company has its own
    // auto-generated username/password (created when a marketer/owner adds
    // the client — see ClientService.createClient).
    @PostMapping("/client-login")
    public ResponseEntity<?> clientLogin(@RequestBody LoginRequest request) {
        return clientService.authenticateClient(request.getUsername(), request.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).body("Invalid username or password"));
    }
}

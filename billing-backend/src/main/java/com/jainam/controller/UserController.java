package com.jainam.controller;

import com.jainam.dto.CreateMarketingUserRequest;
import com.jainam.dto.UserDTO;
import com.jainam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Note: there is no server-side authorization check gating these endpoints —
// the same is true of the rest of this app's API today. The frontend only
// exposes the "Marketing Team" page to the Owner role. If this app grows,
// add real auth (e.g. Spring Security) so these endpoints enforce
// Owner-only access server-side too.
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createMarketingUser(@RequestBody CreateMarketingUserRequest request) {
        return ResponseEntity.ok(userService.createMarketingUser(request));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getMarketingTeam() {
        return ResponseEntity.ok(userService.getMarketingTeam());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarketingUser(@PathVariable Long id) {
        userService.deleteMarketingUser(id);
        return ResponseEntity.noContent().build();
    }
}

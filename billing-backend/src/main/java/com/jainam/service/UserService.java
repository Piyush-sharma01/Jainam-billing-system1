package com.jainam.service;

import com.jainam.dto.CreateMarketingUserRequest;
import com.jainam.dto.UserDTO;
import com.jainam.entity.User;
import com.jainam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserDTO createMarketingUser(CreateMarketingUserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("That username is already taken");
        }

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .passwordHash(hash(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.MARKETING)
                .build();

        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    public List<UserDTO> getMarketingTeam() {
        return userRepository.findByRoleOrderByCreatedAtDesc(User.Role.MARKETING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteMarketingUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != User.Role.MARKETING) {
            throw new RuntimeException("Cannot delete this account");
        }
        userRepository.deleteById(id);
    }

    /**
     * Validates username/password against stored marketing accounts.
     * The Owner login is handled entirely on the frontend (hardcoded), so
     * this only ever matches MARKETING accounts.
     */
    public Optional<UserDTO> authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPasswordHash().equals(hash(password)))
                .map(this::convertToDTO);
    }

    private String hash(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(raw.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Could not hash password", e);
        }
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getUsername(), user.getPhone(), user.getRole());
    }
}

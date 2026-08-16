package com.jainam.service;

import com.jainam.repository.InvoiceRepository;
import com.jainam.dto.ClientDTO;
import com.jainam.entity.Client;
import com.jainam.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClientService {
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private ClientRepository clientRepository;

    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    private final SecureRandom random = new SecureRandom();

    public List<ClientDTO> getVisibleClients(String role, String username) {
        List<Client> clients;
        if ("MARKETING".equalsIgnoreCase(role) && username != null) {
            clients = clientRepository.findByActiveTrueAndCreatedBy(username);
        } else {
            clients = clientRepository.findByActiveTrue();
        }
        return clients.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return convertToDTO(client);
    }

    public List<ClientDTO> searchClients(String keyword) {
        return clientRepository.searchClients(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ClientDTO createClient(ClientDTO clientDTO, String role, String username) {
        Client client = convertToEntity(clientDTO);
        client.setCreatedBy("MARKETING".equalsIgnoreCase(role) && username != null ? username : "owner");

        // Auto-generate storefront login credentials for this client company.
        String generatedUsername = generateUniqueUsername(clientDTO.getCompany());
        String generatedPassword = generatePassword();
        client.setUsername(generatedUsername);
        client.setPasswordHash(hash(generatedPassword));

        Client savedClient = clientRepository.save(client);

        // Return the plaintext password exactly once, so the caller can hand
        // it to the client. It is never persisted or returned again.
        ClientDTO result = convertToDTO(savedClient);
        result.setPassword(generatedPassword);
        return result;
    }

    public Optional<ClientDTO> authenticateClient(String username, String password) {
        return clientRepository.findByUsername(username)
                .filter(c -> Boolean.TRUE.equals(c.getActive()))
                .filter(c -> c.getPasswordHash() != null && c.getPasswordHash().equals(hash(password)))
                .map(this::convertToDTO);
    }

    private String generateUniqueUsername(String company) {
        String base = company == null ? "client" : company.toLowerCase()
                .replaceAll("[^a-z0-9]+", "")
                .trim();
        if (base.isEmpty()) {
            base = "client";
        }
        String candidate = base;
        int suffix = 1;
        while (clientRepository.existsByUsername(candidate)) {
            suffix++;
            candidate = base + suffix;
        }
        return candidate;
    }

    private String generatePassword() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(PASSWORD_CHARS.charAt(random.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
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
        } catch (Exception e) {
            throw new RuntimeException("Could not hash password", e);
        }
    }

    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setCompany(clientDTO.getCompany());
        client.setContactPerson(clientDTO.getContactPerson());
        client.setPhone(clientDTO.getPhone());
        client.setEmail(clientDTO.getEmail());
        client.setGstNumber(clientDTO.getGstNumber());
        client.setAddress(clientDTO.getAddress());

        Client updatedClient = clientRepository.save(client);
        return convertToDTO(updatedClient);
    }

    public void deleteClient(Long id) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        client.setActive(false);

        clientRepository.save(client);
    }

    private ClientDTO convertToDTO(Client client) {
        return new ClientDTO(
                client.getId(),
                client.getCompany(),
                client.getContactPerson(),
                client.getPhone(),
                client.getEmail(),
                client.getGstNumber(),
                client.getAddress(),
                client.getActive(),
                client.getCreatedBy(),
                client.getUsername(),
                null);
    }

    private Client convertToEntity(ClientDTO clientDTO) {
        return Client.builder()
                .company(clientDTO.getCompany())
                .contactPerson(clientDTO.getContactPerson())
                .phone(clientDTO.getPhone())
                .email(clientDTO.getEmail())
                .gstNumber(clientDTO.getGstNumber())
                .address(clientDTO.getAddress())
                .build();
    }
}

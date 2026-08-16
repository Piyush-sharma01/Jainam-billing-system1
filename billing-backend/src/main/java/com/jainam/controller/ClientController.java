package com.jainam.controller;

import com.jainam.dto.ClientDTO;
import com.jainam.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clients")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class ClientController {
    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(clientService.getVisibleClients(role, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<ClientDTO>> searchClients(@PathVariable String keyword) {
        return ResponseEntity.ok(clientService.searchClients(keyword));
    }

    @PostMapping
    public ResponseEntity<ClientDTO> createClient(
            @RequestBody ClientDTO clientDTO,
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(clientService.createClient(clientDTO, role, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClient(id, clientDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}

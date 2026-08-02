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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {
    @Autowired
    private InvoiceRepository invoiceRepository;
    @Autowired
    private ClientRepository clientRepository;

    public List<ClientDTO> getAllClients() {
        return clientRepository.findByActiveTrue()
                .stream()
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

    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        Client savedClient = clientRepository.save(client);
        return convertToDTO(savedClient);
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
                client.getActive());
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

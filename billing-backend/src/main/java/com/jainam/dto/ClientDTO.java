package com.jainam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    private String company;
    private String contactPerson;
    private String phone;
    private String email;
    private String gstNumber;
    private String address;
    private Boolean active;
    private String createdBy;

    // Storefront login. `username` is always returned so the owner/marketing
    // member can hand it to the client. `password` is only ever populated
    // once, right after creation (plaintext, one-time display) — it is never
    // stored in the DTO on subsequent reads.
    private String username;
    private String password;
}

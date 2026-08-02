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
}

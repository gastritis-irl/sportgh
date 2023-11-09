package edu.codespring.sportgh.dto;

import lombok.Data;

@Data
public class ProductOutDTO {

    private Long id;
    private boolean publicContact;
    private String name;
    private String description;
    private Double locationLat;
    private Double locationLng;
    private Double rentPrice;
    private Long categoryId;
    private String categoryName;
    private Long subCategoryId;
    private String subCategoryName;
    private Long userId;
    private String userUid;
    private String username;
    private Long[] imageIds;
}

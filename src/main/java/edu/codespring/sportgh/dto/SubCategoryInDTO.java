package edu.codespring.sportgh.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Valid
@Data
public class SubCategoryInDTO {

    @Min(value = 1, message = "SubCategoryId must be greater than 1")
    private Long id;

    @Size(min = 5, max = 50, message = "Subcategory name must be between 5-50 characters")
    @NotNull(message = "Subcategory name can't be empty")
    private String name;

    @Min(value = 1, message = "CategoryId must be greater than 1")
    @NotNull(message = "Category must be given")
    private Long categoryId;
}


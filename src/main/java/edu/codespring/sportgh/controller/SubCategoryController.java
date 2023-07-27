package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.SubCategoryInDTO;
import edu.codespring.sportgh.dto.SubCategoryOutDTO;
import edu.codespring.sportgh.mapper.SubCategoryMapper;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;
    private final SubCategoryMapper subCategoryMapper;

    @RequestMapping(method = RequestMethod.GET)
    public Collection<SubCategoryOutDTO> findAllSubCategories() {
        Collection<SubCategory> subCategories = subCategoryService.findAll();
        return subCategoryMapper.subCategoriesToOuts(subCategories);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/ids/{subCategoryIDs}")
    public Collection<SubCategoryOutDTO> findByIds(@PathVariable Collection<Long> subCategoryIDs) {
        Collection<SubCategory> subCategories = subCategoryService.findByIds(subCategoryIDs);
        return subCategoryMapper.subCategoriesToOuts(subCategories);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/{subCategoryId}")
    public void deleteById(@PathVariable Long subCategoryId) {
        log.info("Deleting subCategory with ID {}.", subCategoryId);
        subCategoryService.delete(subCategoryId);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteAllSubCategories() {
        subCategoryService.deleteAll();
    }

  @RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, path = "/{subCategoryId}")
  public ResponseEntity<SubCategoryOutDTO> saveSubCategory(@RequestBody SubCategoryInDTO subCategoryInDTO, @PathVariable(required = false) Long subCategoryId) {
    SubCategory subCategory;
    if(subCategoryId != null && subCategoryService.existsById(subCategoryId)){
      log.info("Updating subCategory with ID {}.", subCategoryId);
      subCategory = subCategoryMapper.dtoToSubCategory(subCategoryInDTO);
      subCategory.setId(subCategoryId);
    } else {
      log.info("Creating new subCategory.");
      subCategory = subCategoryMapper.dtoToSubCategory(subCategoryInDTO);
    }
    subCategoryService.save(subCategory);
    SubCategoryOutDTO subCategoryOutDTO1 = subCategoryMapper.subCategoryToOut(subCategory);

    return ResponseEntity.ok(subCategoryOutDTO1);
  }

}

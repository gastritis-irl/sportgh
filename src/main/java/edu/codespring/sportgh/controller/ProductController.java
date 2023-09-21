package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.security.SecurityUtil;
import edu.codespring.sportgh.service.ProductService;
import edu.codespring.sportgh.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;
    private final UserService userService;
    private final SecurityUtil securityUtil;

    @GetMapping
    public ResponseEntity<ProductPageOutDTO> findPageByParams(
        @RequestParam("orderBy") Optional<String> orderBy,
        @RequestParam("direction") Optional<String> direction,
        @RequestParam("pageNumber") Optional<Integer> pageNumber,
        @RequestParam("Subcategory") Optional<String[]> subcategoryNames,
        @RequestParam("MinPrice") Optional<Double> minPrice,
        @RequestParam("MaxPrice") Optional<Double> maxPrice,
        @RequestParam("TextSearch") Optional<String> textSearch
    ) {
        return new ResponseEntity<>(
            productService.findPageByParams(
                orderBy.orElse(null),
                direction.orElse(null),
                pageNumber.orElse(1),
                subcategoryNames.orElse(null),
                minPrice.orElse(null),
                maxPrice.orElse(null),
                textSearch.orElse(null)
            ),
            HttpStatus.OK
        );

    }

    @GetMapping(path = "/{productId}")
    public ResponseEntity<ProductOutDTO> findById(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productMapper.productToOut(product), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductOutDTO> create(@RequestBody @Valid ProductInDTO productInDTO) {
        log.info("Creating product with name: {}.", productInDTO.getName());
        if (productInDTO.getUserId() != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        productInDTO.setUserId(userService.findByFirebaseUid(productInDTO.getUserUid()).getId());
        return productService.saveInDTO(productInDTO);
    }

    @PutMapping(path = "/{productId}")
    public ResponseEntity<ProductOutDTO> update(@RequestBody @Valid ProductInDTO productInDTO,
                                                @PathVariable Long productId) {
        log.info("Updating product with ID {}.", productId);
        Product product = productService.findById(productId);
        if (!Objects.equals(product, productMapper.dtoToProduct(productInDTO))) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!productService.existsById(productId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return productService.saveInDTO(productInDTO);
    }

    @PutMapping(path = "/{productId}/rent")
    public ResponseEntity<ProductOutDTO> rent(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        productService.rent(product);
        return new ResponseEntity<>(productMapper.productToOut(product), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{productId}")
    public ResponseEntity<?> delete(@PathVariable Long productId) {
        Product product = productService.findById(productId);
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (!securityUtil.isCurrentlyLoggedIn(product.getUser())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        productService.delete(product);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

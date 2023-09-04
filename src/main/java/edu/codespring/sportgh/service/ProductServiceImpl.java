package edu.codespring.sportgh.service;

import edu.codespring.sportgh.exception.BadRequestException;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.mapper.ProductMapper;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    static final int pageSize = 60;

    @Override
    public ProductPageOutDTO findPageByCategoryId(Long categoryId, int pageNumber) {
        Page<Product> page = productRepository.findByCategoryId(categoryId, PageRequest.of(pageNumber, pageSize));

        Collection<Product> products = page.getContent();
        long nrOfElements = page.getTotalElements();
        int nrOfPages = page.getTotalPages();

        return productMapper.productPageToOut(products, nrOfPages, nrOfElements);
    }

    @Override
    public Product findById(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    @Override
    public Collection<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public boolean existsByNameAndUser(String name, User user) {
        return productRepository.existsByNameAndUser(name, user);
    }

    @Override
    public boolean existsById(Long productId) {
        return productRepository.existsById(productId);
    }

    @Override
    public void save(Product product) {
        productRepository.save(product);
        log.info("Product saved successfully ({}) with ID: {}", product.getName(), product.getId());
    }

    @Override
    public void rent(Product product) {
        if (product.isAvailable()) {
            product.setAvailable(false);
            save(product);
        } else {
            throw new BadRequestException("This product is currently unavailable.");
        }
    }

    @Override
    public void delete(Product product) {
        productRepository.delete(product);
    }
}

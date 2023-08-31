package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

import edu.codespring.sportgh.model.User;

public interface ProductRepository extends BaseRepository<Product> {

    Pageable pageable = PageRequest.of(pageNumber, pageSize);

    @Query("select p from Product p where p.subCategory.category.id = :categoryId")
    Collection<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    boolean existsByNameAndUser(String name, User user);
}

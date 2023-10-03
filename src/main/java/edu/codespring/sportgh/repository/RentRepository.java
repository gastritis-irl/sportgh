package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface RentRepository extends BaseRepository<RentRequest> {

    RentRequest findByRenterAndProduct(User renter, Product product);

    Collection<RentRequest> findByProduct(Product product);

    @Query("select rr from RentRequest rr where rr.product.user.id = :ownerId")
    Collection<RentRequest> findByProductOwnerId(@Param("ownerId") Long ownerId);
}
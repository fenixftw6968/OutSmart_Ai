package com.outsmartai.backend.repository;

import com.outsmartai.backend.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    List<User> findAllByOrderByTotalScoreDesc(Pageable pageable);
    List<User> findAllByOrderByRatingDesc(Pageable pageable);
    
    long count();
}

package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.User;

import java.util.Collection;

public interface UserService {

    User signup(String userName, String firebaseUid);

    User update(User user);

    Collection<User> findAll();

    User findById(Long userId);

    User findByUsername(String username);

    User findByEmail(String email);

    void deleteById(Long userId);

    void deleteAll();

    User findByFirebaseUid(String firebaseUid);
}


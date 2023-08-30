package edu.codespring.sportgh.service;

import com.google.firebase.auth.*;
import edu.codespring.sportgh.exception.ServiceAuthenticationException;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.User;
import edu.codespring.sportgh.repository.UserRepository;
import edu.codespring.sportgh.security.FirebaseTokenHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class FirebaseServiceImpl implements FirebaseService {

    private final UserRepository userRepository;

    @Override
    public String getFirebaseUidFromToken(String idToken) {
        FirebaseTokenHolder tokenHolder = verifyTokenAndReturnTokenHolder(idToken);
        return tokenHolder.getUid();
    }

    @Override
    public FirebaseTokenHolder verifyTokenAndReturnTokenHolder(String idToken) {
        try {
            FirebaseToken token = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return new FirebaseTokenHolder(token);
        } catch (FirebaseAuthException e) {
            log.error("Invalid firebase token", e);
            throw new ServiceAuthenticationException("Invalid firebase token", e);
        }
    }

    @Override
    public Authentication getAuthentication(String idToken) {
        // Verify the ID token using the Firebase SDK
        FirebaseToken firebaseToken;
        try {
            firebaseToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            throw new ServiceAuthenticationException("Failed to verify the Firebase ID token", e);
        }

        // Extract the UID from the FirebaseToken
        String uid = firebaseToken.getUid();

        // Look up the user in your own database using the UID
        User user = userRepository.findByFirebaseUid(uid);
        if (user == null) {
            throw new ServiceAuthenticationException("User not found with Firebase UID: " + uid);
        }

        // Create a UserDetails object using Spring Security's User class
        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole())
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        // Create an Authentication object using the UserDetails
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Override
    public Collection<User> getUsers() {
        Collection<User> users = new ArrayList<>();
        try {
            ListUsersPage listUsersPage = FirebaseAuth.getInstance().listUsers(null);
            for (ExportedUserRecord i : listUsersPage.getValues()) {
                users.add(new User(
                    i.getEmail(),
                    i.getEmail(),
                    "password", // we've set this password for every registered user in firebase
                    i.getUid(),
                    "USER",
                    null)
                );
            }
        } catch (FirebaseAuthException e) {
            throw new ServiceException("[FbService] listUsers failed!", e);
        }
        return users;
    }
}
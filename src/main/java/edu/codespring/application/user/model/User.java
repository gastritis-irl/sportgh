package edu.codespring.application.user.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Column(name = "username", unique = true, length = 25)
    private String userName;
    @ToString.Exclude
    @Column(length = 64)
    private String password;

    public User(String uuid, Long id, String userName, String password) {
        setUuid(uuid);
        setId(id);
        this.userName = userName;
        this.password = password;
    }

}

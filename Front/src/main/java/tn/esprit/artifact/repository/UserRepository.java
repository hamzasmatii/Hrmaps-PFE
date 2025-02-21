package tn.esprit.artifact.repository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.artifact.entity.User;
import tn.esprit.artifact.entity.UserType;

import java.util.List;
import java.util.Map;
@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findUsersByIdentifiantUser(String identifiant);
    List<User> findUsersByServiceEqId(Long serviceEqId);

    @Query("SELECT u FROM User u WHERE u.type = :type AND NOT EXISTS (SELECT s FROM ServiceEq s WHERE s.chefEquipe = u)")
    List<User> findChefsWithoutServiceEq(@Param("type") UserType type);

    @Query("SELECT u FROM User u WHERE u.type = :type AND u.serviceEq IS NULL")
    List<User> findUsersWithoutServiceEq(@Param("type") UserType type);

    @Query("SELECT u FROM User u JOIN u.formation f WHERE f.id = :formationId")
    List<User> findUsersByFormationId(@Param("formationId") Long formationId);

}

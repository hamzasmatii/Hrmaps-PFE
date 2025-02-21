package tn.esprit.artifact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.artifact.entity.Formation;

import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation,Long> {
    @Query("SELECT f FROM Formation f JOIN f.users u WHERE u.id = :userId")
    List<Formation> findFormationsByUserId(@Param("userId") Long userId);
}

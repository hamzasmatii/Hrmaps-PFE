package tn.esprit.artifact.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.artifact.entity.ServiceEq;

@Repository

public interface ServiceEqRepository extends JpaRepository<ServiceEq,Long> {
    @Query("SELECT s FROM ServiceEq s JOIN s.employes e WHERE e.id = :userId")
    ServiceEq findByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM ServiceEq s JOIN s.chefEquipe e WHERE e.id = :userId")
    ServiceEq findByChefId(@Param("userId") Long userId);
}

package tn.esprit.artifact.repository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.artifact.entity.Competence;

import java.util.List;
import java.util.Map;
@Repository
public interface CompetenceRepository extends JpaRepository<Competence,Long>{
    List<Competence> findByJobPositionId(Long jobPositionId);
}
